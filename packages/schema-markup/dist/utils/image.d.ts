type ImageObjectInput = {
    url: string;
    width?: number;
    height?: number;
};
export type ImageInput = string | ImageObjectInput;
export declare function buildImageObject(input?: ImageInput): Record<string, unknown> | undefined;
export {};
