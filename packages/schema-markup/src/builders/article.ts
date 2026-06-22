import type { Article } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildArticle: SchemaBuilder<Article> =
	defineBuilder<Article>("Article");
