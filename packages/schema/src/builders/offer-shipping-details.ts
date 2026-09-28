import type { OfferShippingDetails } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildOfferShippingDetails: SchemaBuilder<OfferShippingDetails> =
	defineBuilder<OfferShippingDetails>("OfferShippingDetails");
