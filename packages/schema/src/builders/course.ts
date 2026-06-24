import type { Course } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildCourse: SchemaBuilder<Course> = defineBuilder<Course>("Course");
