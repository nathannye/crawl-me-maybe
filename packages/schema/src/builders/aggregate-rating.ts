import type { AggregateRating } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildAggregateRating: SchemaBuilder<AggregateRating> =
	defineBuilder<AggregateRating>("AggregateRating");
