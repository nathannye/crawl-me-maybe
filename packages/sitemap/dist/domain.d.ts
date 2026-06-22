/** Strips trailing slashes from a site origin (e.g. https://example.com/). */
export declare function normalizeDomain(domain: string): string;
/** Returns a site origin with a trailing slash for use as a `URL` base. */
export declare function normalizeDomainBase(domain: string): string;
