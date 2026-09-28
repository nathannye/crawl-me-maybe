import type { HowToStep } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildHowToStep: SchemaBuilder<HowToStep> =
	defineBuilder<HowToStep>("HowToStep");
