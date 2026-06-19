import type { MergedMetadata } from "@crawl-me-maybe/meta";
import type { SchemaDefaults } from "../compose";
import { coalesce } from "../schema-utils";
import type {
	SchemaImage,
	SchemaLocation,
	SchemaOrganization,
	SchemaPerson,
} from "../types";
import { createSchemaImageObject } from "../utils/image";
import { buildPersonOrOrg, formatSchemaDate } from "./utils";

export function buildEvent({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown> {
	const defaults = schemaDefaults?.event || {};

	const name = coalesce(extra?.name, extra?.title, seo.title);
	const description = coalesce(extra?.description, seo.description);
	const image = createSchemaImageObject(
		coalesce(extra?.image, seo.metaImage) as SchemaImage,
		schemaDefaults?.imageFallback,
	);

	const locationData = extra?.location as SchemaLocation | undefined;
	const location = locationData
		? {
				"@type": locationData.url ? "VirtualLocation" : "Place",
				name: locationData.name,
				url: locationData.url,
				address: locationData.address,
				geo: locationData.geo
					? {
							"@type": "GeoCoordinates",
							latitude: locationData.geo.latitude,
							longitude: locationData.geo.longitude,
						}
					: undefined,
			}
		: undefined;

	const organizer = coalesce(
		extra?.organizer,
		defaults.organizer,
		schemaDefaults?.organization,
	) as SchemaOrganization | SchemaPerson | undefined;

	const organizerSchema = Array.isArray(organizer)
		? (organizer as Array<SchemaPerson | SchemaOrganization>)
				.map((org) => buildPersonOrOrg(org, true, seo.canonicalUrl))
				.filter(Boolean)
		: buildPersonOrOrg(
				organizer as SchemaPerson | SchemaOrganization,
				true,
				seo.canonicalUrl,
			);

	const performer = extra?.performer
		? (extra.performer as Array<SchemaPerson | SchemaOrganization>)
				.map((perf) => buildPersonOrOrg(perf, true, seo.canonicalUrl))
				.filter(Boolean)
		: undefined;

	return {
		"@context": "https://schema.org",
		"@type": "Event",
		name,
		description,
		image,
		startDate: formatSchemaDate(extra?.startDate as string | Date | undefined),
		endDate: formatSchemaDate(extra?.endDate as string | Date | undefined),
		eventStatus: extra?.eventStatus
			? `https://schema.org/${extra.eventStatus}`
			: undefined,
		eventAttendanceMode: coalesce(
			extra?.eventAttendanceMode,
			defaults.eventAttendanceMode,
		)
			? `https://schema.org/${(extra?.eventAttendanceMode || defaults.eventAttendanceMode) as string}`
			: undefined,
		location,
		organizer: organizerSchema,
		performer,
		offers: extra?.offers,
		url: seo.canonicalUrl,
	};
}
