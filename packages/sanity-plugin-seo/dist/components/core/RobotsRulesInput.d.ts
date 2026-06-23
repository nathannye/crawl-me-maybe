import type { ArrayOfObjectsInputProps } from "sanity";
type RobotsRuleItem = {
    _key?: string;
    userAgent?: string;
    allow?: string;
    disallow?: string;
};
export default function RobotsRulesInput(props: ArrayOfObjectsInputProps<RobotsRuleItem & {
    _key: string;
}>): import("react").JSX.Element;
export {};
