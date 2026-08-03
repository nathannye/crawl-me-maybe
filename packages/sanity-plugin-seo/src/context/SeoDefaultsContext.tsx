import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useClient } from "sanity";
import type { ResolveValue } from "../types";

type SeoDefaultsContextValue = {
	seoDefaults: Record<string, unknown> | null;
	resolveValue: ResolveValue;
};

const identityResolveValue: ResolveValue = (value) => value;

const SeoDefaultsContext = createContext<SeoDefaultsContextValue>({
	seoDefaults: null,
	resolveValue: identityResolveValue,
});

type SeoDefaultsProviderProps = {
	children: ReactNode;
	resolveValue?: ResolveValue;
};

export const SeoDefaultsProvider = ({
	children,
	resolveValue = identityResolveValue,
}: SeoDefaultsProviderProps) => {
	const client = useClient({ apiVersion: "2025-01-11" });
	const [seoDefaults, setSeoDefaults] = useState<Record<
		string,
		unknown
	> | null>(null);

	const sub = useCallback(
		(query: string) => {
			return client.listen(query).subscribe((update) => {
				if (update.result) {
					setSeoDefaults(update.result as Record<string, unknown>);
				}
			});
		},
		[client],
	);

	useEffect(() => {
		const seoSub = sub(`*[_type == "globalSeoSettings"][0]`);

		client
			.fetch(`*[_type == "globalSeoSettings"][0]`)
			.then((result) =>
				setSeoDefaults((result as Record<string, unknown> | null) ?? null),
			);

		return () => {
			seoSub.unsubscribe();
		};
	}, [client, sub]);

	const value = useMemo(
		() => ({
			seoDefaults,
			resolveValue,
		}),
		[resolveValue, seoDefaults],
	);

	return (
		<SeoDefaultsContext.Provider value={value}>
			{children}
		</SeoDefaultsContext.Provider>
	);
};

export const useSeoDefaults = () => useContext(SeoDefaultsContext);
