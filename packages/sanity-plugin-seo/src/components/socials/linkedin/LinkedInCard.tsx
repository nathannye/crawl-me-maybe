import { Avatar, Box, Flex, Stack, Text } from "@sanity/ui";
import type { PreviewCardProps } from "../../../types";
import { truncate } from "../../../utils/string";
import SocialCardWrapper from "../../partials/SocialCardWrapper";
import styles from "./LinkedInCard.module.css";

export function LinkedInCard(props: PreviewCardProps) {
	const fallback = {
		title: "My Awesome Page",
		description:
			"A concise preview crafted for LinkedIn feeds. Keep it clear, professional, and easy to scan.",
		image: "https://placehold.co/1200x627",
		siteUrl: "mywebsite.com",
		siteTitle: "My Website",
		avatar: "https://placehold.co/40x40",
	};
	const data = { ...fallback, ...props };

	return (
		<SocialCardWrapper className={styles.linkedInCard}>
			<Flex gap={2} padding={3} className={styles.header}>
				<Avatar src={data.avatar} size={3} />
				<Stack space={2}>
					<Text weight="semibold" size={2}>
						{data.siteTitle}
					</Text>
					<Text size={1} muted>
						{data.siteUrl}
					</Text>
				</Stack>
			</Flex>
			<Box className={styles.imageWrapper}>
				<img className={styles.image} src={data.image} alt="LinkedIn preview" />
			</Box>
			<Box padding={3}>
				<Stack space={3}>
					<Text size={1} muted>
						{data.siteUrl}
					</Text>
					<Text weight="semibold" size={3}>
						{truncate(data.title, 70)}
					</Text>
					<Text size={2}>{truncate(data.description, 140)}</Text>
				</Stack>
			</Box>
		</SocialCardWrapper>
	);
}

export default LinkedInCard;
