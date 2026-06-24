import type { Product } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildProduct: SchemaBuilder<Product> =
	defineBuilder<Product>("Product");
