import type { Movie } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildMovie: SchemaBuilder<Movie> = defineBuilder<Movie>("Movie");
