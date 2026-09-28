import type { Brand } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildBrand: SchemaBuilder<Brand> = defineBuilder<Brand>("Brand");
