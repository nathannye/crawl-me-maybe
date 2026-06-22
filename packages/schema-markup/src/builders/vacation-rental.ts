import type { VacationRental } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildVacationRental: SchemaBuilder<VacationRental> =
	defineBuilder<VacationRental>("VacationRental");
