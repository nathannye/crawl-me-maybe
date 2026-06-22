import type { Question } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildQuestion: SchemaBuilder<Question> =
	defineBuilder<Question>("Question");
