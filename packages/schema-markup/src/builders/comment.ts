import type { Comment } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildComment: SchemaBuilder<Comment> =
	defineBuilder<Comment>("Comment");
