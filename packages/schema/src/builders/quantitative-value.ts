import type { QuantitativeValue } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildQuantitativeValue: SchemaBuilder<QuantitativeValue> =
	defineBuilder<QuantitativeValue>("QuantitativeValue");
