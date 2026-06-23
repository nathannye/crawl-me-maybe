import type { PluginOptions } from "../../types";
import buildGlobalSeoSettings from "./global-seo-settings";

export default function buildDocuments(options?: PluginOptions) {
	return [buildGlobalSeoSettings(options)];
}
