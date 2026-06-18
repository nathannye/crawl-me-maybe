import { type ButtonProps } from "@sanity/ui";
import type { IconType } from "react-icons/lib";
export default function ButtonWithIcon({ icon, buttonProps, label, }: {
    icon: IconType;
    buttonProps?: ButtonProps;
    label: string;
}): import("react").JSX.Element;
