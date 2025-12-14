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
	const client = useClient({ apiVersion: "2024-10-01" });
	const [defaults, setDefaults] = useState({
		seoDefaults: null,
		schemaDefaults: null,
	});

	const cleanup = useCallback(() => {
		// return function for useEffect cleanup
		if (cleanup.seoSub) {
			cleanup.seoSub.unsubscribe();
		}
		if (cleanup.schemaSub) {
			cleanup.schemaSub.unsubscribe();
		}
	}, []);

	const sub = (query: string, property: string) => {
		return client.listen(query).subscribe((update) => {
			if (update.result) {
				setDefaults((prev) => ({
					...prev,
					[property]: update.result,
				}));
			}
		});
	};

	useEffect(() => {
		const seoSub = sub(`*[_type == "seoDefaults"][0]`, "seoDefaults");
		const schemaSub = sub(
			`*[_type == "schemaMarkupDefaults"][0]`,
			"schemaDefaults",
		);

		cleanup.seoSub = seoSub;
		cleanup.schemaSub = schemaSub;

		client.fetch(`*[_type == "seoDefaults"][0]`).then((seoDefaults) =>
			setDefaults((prev) => ({
				...prev,
				seoDefaults,
			})),
		);

		client
			.fetch(`*[_type == "schemaMarkupDefaults"][0]`)
			.then((schemaDefaults) =>
				setDefaults((prev) => ({
					...prev,
					schemaDefaults,
				})),
			);

		return cleanup;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [client]);

	return (
		<SeoDefaultsContext.Provider value={defaults}>
			{children}
		</SeoDefaultsContext.Provider>
	);
};

export const useSeoDefaults = () => useContext(SeoDefaultsContext);
