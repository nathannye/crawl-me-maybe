import type { WebPage } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildWebPage: SchemaBuilder<WebPage> =
	defineBuilder<WebPage>("WebPage");
