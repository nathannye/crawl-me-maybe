export declare const normalizeUrl: (baseUrl: string, path: string) => string;
export declare const isAbsoluteUrl: (value: string) => boolean;
export declare const isCanonicalPath: (value: string) => boolean;
export declare const validateCanonicalPathOrUrl: (value: unknown) => true | string;
export declare const resolveCanonicalUrl: (siteUrl: string, canonicalOrPath: string) => string;
