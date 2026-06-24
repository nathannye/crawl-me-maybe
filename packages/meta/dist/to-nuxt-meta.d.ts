import type { Head, MetaFlatInput } from "zhead";
import type { MergedMetadata } from "./merge";
export type NuxtMeta = MetaFlatInput & Pick<Head, "title">;
export declare function toNuxtMeta(meta: MergedMetadata): NuxtMeta;
