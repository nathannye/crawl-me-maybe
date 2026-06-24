import type { Recipe } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildRecipe: SchemaBuilder<Recipe> = defineBuilder<Recipe>("Recipe");
