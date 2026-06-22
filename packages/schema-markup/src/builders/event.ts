import type { Event } from "schema-dts";
import { defineBuilder } from "../define-builder";

export const buildEvent = defineBuilder<Event>("Event");
