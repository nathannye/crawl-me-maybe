import type { LocalBusiness } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildLocalBusiness: SchemaBuilder<LocalBusiness> =
	defineBuilder<LocalBusiness>("LocalBusiness");
