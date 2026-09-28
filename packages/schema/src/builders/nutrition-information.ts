import type { NutritionInformation } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildNutritionInformation: SchemaBuilder<NutritionInformation> =
	defineBuilder<NutritionInformation>("NutritionInformation");
