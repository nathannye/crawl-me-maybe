import type { VideoObject } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildVideoObject: SchemaBuilder<VideoObject> =
	defineBuilder<VideoObject>("VideoObject");
