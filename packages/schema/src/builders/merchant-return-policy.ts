import type { MerchantReturnPolicy } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildMerchantReturnPolicy: SchemaBuilder<MerchantReturnPolicy> =
	defineBuilder<MerchantReturnPolicy>("MerchantReturnPolicy");
