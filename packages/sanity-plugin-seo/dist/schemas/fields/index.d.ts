declare const _default: (({
    type: "image";
    name: "favicon";
} & Omit<import("sanity").ImageDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<Record<string, string>, Record<never, any>> | undefined;
} & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue) | ({
    type: "text";
    name: "metaDescription";
} & Omit<import("sanity").TextDefinition, "preview"> & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue) | ({
    type: "object";
    name: "searchIndexing";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<Record<string, string>, Record<never, any>> | undefined;
} & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue) | {
    name: string;
    title: string;
    components: {
        input: typeof import("../../components/core/PageSeoInput/PageSeoInput").default;
    };
    type: string;
    fields: ({
        name: string;
        title: string;
        components: {
            input: typeof import("../../components/core").InputWithGlobalDefault;
        };
        options: {
            matchingDefaultField: string;
        };
        type: string;
        rows: number;
        description: string;
        validation: (Rule: any) => any;
    } | {
        name: string;
        type: string;
        title?: undefined;
        components?: undefined;
        options?: undefined;
        rows?: undefined;
        description?: undefined;
        validation?: undefined;
    } | {
        name: string;
        components: {
            input: typeof import("../../components/core").InputWithGlobalDefault;
        };
        options: {
            matchingDefaultField: string;
        };
        title: string;
        description: string;
        type: string;
        rows?: undefined;
        validation?: undefined;
    })[];
})[];
export default _default;
