import type { SanityAssetDocument } from "@sanity/client";
export type Favicon = {
    type: string;
    sizes?: string;
    href: string;
};
export declare const createFavicons: (favicon: SanityAssetDocument | undefined) => Favicon[] | null;
