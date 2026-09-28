import type { CourseInstance } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildCourseInstance: SchemaBuilder<CourseInstance> =
	defineBuilder<CourseInstance>("CourseInstance");
