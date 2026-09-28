import type { Offer } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildOffer: SchemaBuilder<Offer> = defineBuilder<Offer>("Offer");
