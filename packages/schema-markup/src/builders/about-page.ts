import type { AboutPage } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildAboutPage: SchemaBuilder<AboutPage> =
	defineBuilder<AboutPage>("AboutPage");
