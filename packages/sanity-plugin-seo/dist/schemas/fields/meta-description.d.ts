declare const _default: {
    type: "text";
    name: "metaDescription";
} & Omit<import("sanity").TextDefinition, "preview"> & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue;
export default _default;
