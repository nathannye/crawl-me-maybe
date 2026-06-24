import type { Review } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildReview: SchemaBuilder<Review> =
	defineBuilder<Review>("Review");
