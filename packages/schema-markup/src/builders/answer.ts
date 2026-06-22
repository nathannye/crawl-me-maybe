import type { Answer } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildAnswer: SchemaBuilder<Answer> = defineBuilder<Answer>("Answer");
