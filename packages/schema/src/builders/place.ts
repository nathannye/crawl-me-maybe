import type { Place } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildPlace: SchemaBuilder<Place> = defineBuilder<Place>("Place");
