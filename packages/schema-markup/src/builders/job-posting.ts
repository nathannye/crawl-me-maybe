import type { JobPosting } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildJobPosting: SchemaBuilder<JobPosting> =
	defineBuilder<JobPosting>("JobPosting");
