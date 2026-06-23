import { Card } from "@sanity/ui";

export default function SocialCardWrapper(props: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Card
			width="100%"
			border={false}
			radius={2}
			tone="neutral"
			className={props.className}
		>
			{props.children}
		</Card>
	);
}
