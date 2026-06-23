import InputWithGlobalDefault from "../../components/core/InputWithGlobalDefault";
import PageSeoInput from "../../components/core/PageSeoInput/PageSeoInput";
import type { PluginOptions } from "../../types";
export default function buildPageMetadata(options?: PluginOptions): {
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
            input: typeof InputWithGlobalDefault;
        };
        options: {
            matchingDefaultField: string;
        };
        description: string;
        type: string;
        title?: undefined;
    })[];
};
