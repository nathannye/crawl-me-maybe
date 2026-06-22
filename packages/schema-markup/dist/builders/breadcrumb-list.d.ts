import type { BreadcrumbList, WithContext } from "schema-dts";
export type BreadcrumbItemInput = {
    title: string;
    url: string;
};
export type BuildBreadcrumbListSchemaInput = {
    pageUrl: string;
    pageTitle: string;
    items?: BreadcrumbItemInput[];
};
export declare function buildBreadcrumbListSchema({ pageUrl, pageTitle, items, }: BuildBreadcrumbListSchemaInput): WithContext<BreadcrumbList>;
