import type { WebSite } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildWebSite: SchemaBuilder<WebSite> =
	defineBuilder<WebSite>("WebSite");
