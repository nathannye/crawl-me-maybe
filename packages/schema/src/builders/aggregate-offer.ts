import type { AggregateOffer } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildAggregateOffer: SchemaBuilder<AggregateOffer> =
	defineBuilder<AggregateOffer>("AggregateOffer");
