import type { SoftwareApplication } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildSoftwareApplication: SchemaBuilder<SoftwareApplication> =
	defineBuilder<SoftwareApplication>("SoftwareApplication");
