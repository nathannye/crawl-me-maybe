import type { ContactPage } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildContactPage: SchemaBuilder<ContactPage> =
	defineBuilder<ContactPage>("ContactPage");
