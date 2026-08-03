import type { PluginOptions } from "../../types";
import favicon from "./favicon";
import buildMetaDescription from "./meta-description";
import metaImage from "./meta-image";
import buildMetaTitle from "./meta-title";
import buildPageMetadata from "./page-metadata";
import robots from "./robots";
import indexing from "./search-indexing";

export default function buildFieldTypes(options?: PluginOptions) {
	const includeFavicon = options?.global?.favicon !== false;
	const includeRobots = options?.global?.robots !== false;

	return [
		indexing,
		buildPageMetadata(options),
		buildMetaDescription(options?.fieldTypes?.metaDescription),
		buildMetaTitle(options?.fieldTypes?.metaTitle),
		metaImage,
		...(includeFavicon ? [favicon] : []),
		...(includeRobots ? [robots] : []),
	];
}
