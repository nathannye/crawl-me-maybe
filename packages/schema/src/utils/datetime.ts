export type DurationParts = {
	years?: number;
	months?: number;
	weeks?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
};

const DATE_DESIGNATORS = [
	["years", "Y"],
	["months", "M"],
	["weeks", "W"],
	["days", "D"],
] as const;

const TIME_DESIGNATORS = [
	["hours", "H"],
	["minutes", "M"],
	["seconds", "S"],
] as const;

const formatParts = (
	parts: DurationParts,
	designators: ReadonlyArray<readonly [keyof DurationParts, string]>,
): string =>
	designators
		.map(([key, designator]) => {
			const value = parts[key];
			return value ? `${value}${designator}` : "";
		})
		.join("");

export function toIsoDuration(parts: DurationParts): string {
	for (const [key, value] of Object.entries(parts)) {
		if (value === undefined) continue;
		if (!Number.isFinite(value) || value < 0) {
			throw new Error(
				`toIsoDuration: "${key}" must be a non-negative finite number, got ${value}`,
			);
		}
		if (key !== "seconds" && !Number.isInteger(value)) {
			throw new Error(
				`toIsoDuration: only "seconds" may be fractional, got ${key}: ${value}`,
			);
		}
	}

	// ISO 8601-1 does not allow weeks to be combined with other parts.
	if (
		parts.weeks &&
		Object.entries(parts).some(([key, value]) => key !== "weeks" && value)
	) {
		throw new Error(
			'toIsoDuration: "weeks" cannot be combined with other parts',
		);
	}

	const datePart = formatParts(parts, DATE_DESIGNATORS);
	const timePart = formatParts(parts, TIME_DESIGNATORS);

	if (!datePart && !timePart) return "PT0S";
	return `P${datePart}${timePart ? `T${timePart}` : ""}`;
}

const ISO_DATE_PATTERN =
	/^(\d{4}-\d{2}-\d{2})(?:(T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)(Z|[+-]\d{2}:?\d{2})?)?$/;

export function toIsoDate(value: Date | string): string {
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) {
			throw new Error("toIsoDate: received an invalid Date");
		}
		return value.toISOString();
	}

	const trimmed = value.trim();
	const match = ISO_DATE_PATTERN.exec(trimmed);
	if (!match || Number.isNaN(Date.parse(`${match[1]}T00:00:00Z`))) {
		throw new Error(`toIsoDate: "${value}" is not an ISO 8601 date`);
	}

	const [, date, time = "", offset = ""] = match;
	const normalizedOffset =
		offset.length === 5 ? `${offset.slice(0, 3)}:${offset.slice(3)}` : offset;

	return `${date}${time}${normalizedOffset}`;
}
