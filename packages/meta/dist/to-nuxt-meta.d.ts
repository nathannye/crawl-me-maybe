import type { Head } from "zhead";
import type { MergedMetadata } from "./merge";
export type NuxtMeta = Pick<Head, "title" | "meta" | "link">;
export declare function toNuxtMeta(meta: MergedMetadata): NuxtMeta;
