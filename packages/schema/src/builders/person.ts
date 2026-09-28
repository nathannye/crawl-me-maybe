import type { Person } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildPerson: SchemaBuilder<Person> =
	defineBuilder<Person>("Person");
