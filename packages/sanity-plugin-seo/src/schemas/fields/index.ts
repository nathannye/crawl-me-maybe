import favicon from "./favicon";
import metaDescription from "./meta-description";
import metaImage from "./meta-image";
import metaTitle from "./meta-title";
import buildPageMetadata from "./page-metadata";
import robots from "./robots";
import indexing from "./search-indexing";
import type { PluginOptions } from "../../types";

export default function buildFieldTypes(options?: PluginOptions) {
	const includeFavicon = options?.global?.favicon !== false;
	const includeRobots = options?.global?.robots !== false;

	return [
		indexing,
		buildPageMetadata(options),
		metaDescription,
		metaTitle,
		metaImage,
		...(includeFavicon ? [favicon] : []),
		...(includeRobots ? [robots] : []),
	];
}
