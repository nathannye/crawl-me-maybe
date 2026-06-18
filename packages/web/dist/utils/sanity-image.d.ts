/**
 * Build a Sanity image URL with optional transformations
 */
export declare function urlFor(imageRef: string): {
    size: (w: number, h: number) => /*elided*/ any;
    format: (fm: string) => /*elided*/ any;
    quality: (q: number) => /*elided*/ any;
    url: () => string;
};
