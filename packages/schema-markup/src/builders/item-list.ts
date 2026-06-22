import type { ItemList } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildItemList: SchemaBuilder<ItemList> =
	defineBuilder<ItemList>("ItemList");
