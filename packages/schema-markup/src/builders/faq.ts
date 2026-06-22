import type { FAQPage } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildFAQPage: SchemaBuilder<FAQPage> =
	defineBuilder<FAQPage>("FAQPage");
