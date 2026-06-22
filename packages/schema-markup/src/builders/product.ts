import type { Product } from "schema-dts";
import { defineBuilder } from "../define-builder";

export const buildProduct = defineBuilder<Product>("Product");
