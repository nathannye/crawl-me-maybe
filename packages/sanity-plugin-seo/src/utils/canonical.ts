export const validateCanonicalPathOrUrl = (value: unknown): true | string => {
	if (value === undefined || value === null || value === "") return true;
	if (typeof value !== "string") return "Must be a string";

	const trimmed = value.trim();
	if (!trimmed) return true;

	if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
		if (/\s/.test(trimmed)) return "Path cannot contain spaces";
		return true;
	}

	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
			return "Must be a path starting with '/' or a full https:// URL";
		}
	} catch {
		return "Must be a path starting with '/' (e.g. /about) or a full https:// URL";
	}

	if (!trimmed.startsWith("https://")) {
		return "URL must start with https://";
	}

	return true;
};
