const SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i;

export function toAbsoluteUrl(
	value: string | null | undefined,
	siteUrl: string,
): string | undefined {
	const trimmed = value?.trim();
	if (!trimmed) return undefined;

	if (SCHEME_PATTERN.test(trimmed)) return trimmed;

	if (trimmed.startsWith("//")) {
		const protocol = SCHEME_PATTERN.exec(siteUrl)?.[0] ?? "https:";
		return `${protocol}${trimmed}`;
	}

	return `${siteUrl.replace(/\/+$/, "")}/${trimmed.replace(/^\/+/, "")}`;
}
