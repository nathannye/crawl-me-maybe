import type { PluginOptions } from "../../types";
export default function buildFieldTypes(options?: PluginOptions): (({
    type: "image";
    name: "favicon";
} & Omit<import("sanity").ImageDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<Record<string, string>, Record<never, any>> | undefined;
} & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue) | ({
    type: "text";
    name: "metaDescription";
} & Omit<import("sanity").TextDefinition, "preview"> & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue) | ({
    type: "image";
    name: "metaImage";
} & Omit<import("sanity").ImageDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<Record<string, string>, Record<never, any>> | undefined;
} & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue) | ({
    type: "string";
    name: "metaTitle";
} & Omit<import("sanity").StringDefinition, "preview"> & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue) | {
    name: string;
    title: string;
    components: {
        input: typeof import("../../components/core/PageSeoInput/PageSeoInput").default;
    };
    type: string;
    fields: (({
        type: "string";
        name: "canonicalUrl";
    } & Omit<import("sanity").StringDefinition, "preview"> & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue) | {
        name: string;
        title: string;
        components: {
            input: typeof import("../../components/core").InputWithGlobalDefault;
        };
        options: {
            matchingDefaultField: string;
        };
        type: string;
        description?: undefined;
    } | {
        name: string;
        type: string;
        title?: undefined;
        components?: undefined;
        options?: undefined;
        description?: undefined;
    } | {
        name: string;
        components: {
            input: typeof import("../../components/core").InputWithGlobalDefault;
        };
        options: {
            matchingDefaultField: string;
        };
        description: string;
        type: string;
        title?: undefined;
    })[];
} | ({
    type: "array";
    name: "robots";
} & Omit<import("sanity").ArrayDefinition, "preview"> & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue) | ({
    type: "object";
    name: "searchIndexing";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<Record<string, string>, Record<never, any>> | undefined;
} & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue))[];
