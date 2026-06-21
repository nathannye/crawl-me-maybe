import { Card } from "@sanity/ui";

export default function SocialCardWrapper(props: {
	children: React.ReactNode;
}) {
	return (
		<Card width="100%" border={false} radius={2} tone="neutral">
			{props.children}
		</Card>
	);
}
