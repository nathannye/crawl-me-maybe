declare const _default: {
    type: "array";
    name: "robots";
} & Omit<import("sanity").ArrayDefinition, "preview"> & import("sanity").FieldDefinitionBase & import("sanity").WidenValidation & import("sanity").WidenInitialValue;
export default _default;
