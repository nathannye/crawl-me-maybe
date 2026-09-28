import type { MonetaryAmount } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildMonetaryAmount: SchemaBuilder<MonetaryAmount> =
	defineBuilder<MonetaryAmount>("MonetaryAmount");
