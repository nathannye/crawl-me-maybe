import type { SanityImageAssetDocument } from "@sanity/client";
import type { ImageObject } from "schema-dts";
export declare function createSchemaImageObject(image?: SanityImageAssetDocument, fallback?: SanityImageAssetDocument): ImageObject | undefined;
