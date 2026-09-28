import type { Organization } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildOrganization: SchemaBuilder<Organization> =
	defineBuilder<Organization>("Organization");
