import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useClient } from "sanity";

const SeoDefaultsContext = createContext(null);

export const SeoDefaultsProvider = ({ children }) => {
	const client = useClient({ apiVersion: "2025-01-11" });
	const [defaults, setDefaults] = useState({
		seoDefaults: null,
	});

	const cleanup = useCallback(() => {
		if (cleanup.seoSub) {
			cleanup.seoSub.unsubscribe();
		}
	}, []);

	const sub = useCallback(
		(query: string, property: string) => {
			return client.listen(query).subscribe((update) => {
				if (update.result) {
					setDefaults((prev) => ({
						...prev,
						[property]: update.result,
					}));
				}
			});
		},
		[client],
	);

	useEffect(() => {
		const seoSub = sub(`*[_type == "globalSeoSettings"][0]`, "seoDefaults");

		cleanup.seoSub = seoSub;

		client.fetch(`*[_type == "globalSeoSettings"][0]`).then((seoDefaults) =>
			setDefaults((prev) => ({
				...prev,
				seoDefaults,
			})),
		);

		return cleanup;
	}, [client, cleanup, sub]);

	return (
		<SeoDefaultsContext.Provider value={defaults}>
			{children}
		</SeoDefaultsContext.Provider>
	);
};

export const useSeoDefaults = () => useContext(SeoDefaultsContext);
