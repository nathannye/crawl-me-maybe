export const normalizeUrl = (baseUrl: string, path: string) => {
	return new URL(path, baseUrl).toString();
};

export const isAbsoluteUrl = (value: string): boolean => {
	try {
		const parsed = new URL(value);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
};

export const isCanonicalPath = (value: string): boolean => {
	const trimmed = value.trim();
	return trimmed.startsWith("/") && !trimmed.startsWith("//");
};

export const resolveCanonicalUrl = (
	siteUrl: string,
	canonicalOrPath: string,
): string => {
	const trimmed = canonicalOrPath.trim();

	if (isAbsoluteUrl(trimmed)) {
		return trimmed;
	}

	if (isCanonicalPath(trimmed)) {
		return normalizeUrl(siteUrl, trimmed);
	}

	return normalizeUrl(siteUrl, trimmed);
};
