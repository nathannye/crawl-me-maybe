import InputWithGlobalDefault from "../../components/core/InputWithGlobalDefault";
import PageSeoInput from "../../components/core/PageSeoInput/PageSeoInput";
declare const _default: {
    name: string;
    title: string;
    components: {
        input: typeof PageSeoInput;
    };
    type: string;
    fields: ({
        name: string;
        title: string;
        components: {
            input: typeof InputWithGlobalDefault;
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
            input: typeof InputWithGlobalDefault;
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
};
export default _default;
