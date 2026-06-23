import type { MergedMetadata } from "./merge";
export type MetaTag = Record<string, string>;
export type LinkTag = Record<string, string>;
export type HtmlTagsOutput = {
    title: string;
    tags: MetaTag[];
    links: LinkTag[];
};
export declare function toHtmlTags(meta: MergedMetadata): HtmlTagsOutput;
