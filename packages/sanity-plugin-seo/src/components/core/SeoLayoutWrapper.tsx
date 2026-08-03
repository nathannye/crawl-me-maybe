import type { LayoutProps } from "sanity";
import { SeoDefaultsProvider } from "../../context/SeoDefaultsContext";
import type { ResolveValue } from "../../types";

export default function createSeoLayoutWrapper(resolveValue?: ResolveValue) {
	return function SeoLayoutWrapper(props: LayoutProps) {
		return (
			<SeoDefaultsProvider resolveValue={resolveValue}>
				{props.renderDefault(props)}
			</SeoDefaultsProvider>
		);
	};
}
