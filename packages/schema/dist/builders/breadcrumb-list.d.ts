import type { BreadcrumbList, WithContext } from "schema-dts";
export type BreadcrumbItemInput = {
    title: string;
    url: string;
};
export type BuildBreadcrumbListSchemaInput = {
    pagePath: string;
    pageTitle: string;
    items?: BreadcrumbItemInput[];
};
export declare function buildBreadcrumbListSchema({ pagePath, pageTitle, items, }: BuildBreadcrumbListSchemaInput): WithContext<BreadcrumbList>;
