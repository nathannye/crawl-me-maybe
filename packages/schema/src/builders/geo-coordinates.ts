import type { GeoCoordinates } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildGeoCoordinates: SchemaBuilder<GeoCoordinates> =
	defineBuilder<GeoCoordinates>("GeoCoordinates");
