import type { QAPage } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildQAPage: SchemaBuilder<QAPage> =
	defineBuilder<QAPage>("QAPage");
