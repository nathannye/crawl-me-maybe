import type { PluginOptions } from "../../types";
export default function buildGlobalSeoSettings(options?: PluginOptions): {
    type: "document";
    name: "globalSeoSettings";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<Record<string, string>, Record<never, any>> | undefined;
};
