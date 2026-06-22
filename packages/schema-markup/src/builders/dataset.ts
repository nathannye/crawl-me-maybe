import type { Dataset } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildDataset: SchemaBuilder<Dataset> =
	defineBuilder<Dataset>("Dataset");
