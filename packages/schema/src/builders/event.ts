import type { Event } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildEvent: SchemaBuilder<Event> = defineBuilder<Event>("Event");
