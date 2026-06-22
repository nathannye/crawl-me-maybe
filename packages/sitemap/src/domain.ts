/** Strips trailing slashes from a site origin (e.g. https://example.com/). */
export function normalizeDomain(domain: string): string {
	return domain.replace(/\/+$/, "");
}

/** Returns a site origin with a trailing slash for use as a `URL` base. */
export function normalizeDomainBase(domain: string): string {
	return `${normalizeDomain(domain)}/`;
}
