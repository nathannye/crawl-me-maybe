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

export const validateCanonicalPathOrUrl = (value: unknown): true | string => {
	if (value === undefined || value === null || value === "") return true;
	if (typeof value !== "string") return "Must be a string";

	const trimmed = value.trim();
	if (!trimmed) return true;

	if (isCanonicalPath(trimmed)) {
		if (/\s/.test(trimmed)) return "Path cannot contain spaces";
		return true;
	}

	if (isAbsoluteUrl(trimmed)) {
		if (!trimmed.startsWith("https://")) {
			return "URL must start with https://";
		}
		return true;
	}

	return "Must be a path starting with '/' (e.g. /about) or a full https:// URL";
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
