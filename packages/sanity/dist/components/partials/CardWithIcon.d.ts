import { type CardTone } from "@sanity/ui";
import type { IconType } from "react-icons/lib";
export default function CardWithIcon({ icon, text, tone, }: {
    icon: IconType;
    text: string;
    tone?: CardTone;
}): import("react").JSX.Element;
