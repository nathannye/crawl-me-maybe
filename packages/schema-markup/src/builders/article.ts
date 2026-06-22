import type { Article } from "schema-dts";
import { defineBuilder } from "../define-builder";

export const buildArticle = defineBuilder<Article>("Article");
