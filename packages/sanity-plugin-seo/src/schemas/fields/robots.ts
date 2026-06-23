import { FaRobot } from "react-icons/fa";
import { defineField } from "sanity";
import RobotsRulesInput from "../../components/core/RobotsRulesInput";

const validateRobotsDirectivePath = (value: unknown) => {
	if (value === undefined || value === null || value === "") return true;
	if (typeof value !== "string") return "Must be a string path";

	const trimmed = value.trim();
	if (!trimmed) return "Path cannot be empty";
	if (!trimmed.startsWith("/")) {
		return "Path must start with '/' (e.g. /, /private, /api/)";
	}

	return true;
};

export default defineField({
	name: "robots",
	title: "Robots",
	description: "Define robots.txt rules",
	type: "array",
	components: {
		input: RobotsRulesInput,
	},
	of: [
		{
			type: "object",
			title: "Rule",
			icon: FaRobot,
			options: {
				columns: 3,
			},
			preview: {
				select: {
					userAgent: "userAgent",
					allow: "allow",
					disallow: "disallow",
				},
				prepare({ userAgent, allow, disallow }) {
					const parts = [];

					if (allow) parts.push(`Allow: ${allow}`);
					if (disallow) parts.push(`Disallow: ${disallow}`);
					if (parts.length === 0) parts.push("No rules");

					return {
						title: userAgent,
						subtitle: parts.join(", \n"),
					};
				},
			},
			fields: [
				{
					name: "userAgent",
					title: "User Agent",
					type: "string",
					validation: (Rule) => Rule.required(),
				},
				{
					name: "allow",
					title: "Allow",
					type: "string",
					validation: (Rule) => Rule.custom(validateRobotsDirectivePath),
				},
				{
					name: "disallow",
					title: "Disallow",
					type: "string",
					validation: (Rule) => Rule.custom(validateRobotsDirectivePath),
				},
			],
		},
	],
});
