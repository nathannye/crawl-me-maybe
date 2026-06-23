import { defineField } from "sanity";

export default defineField({
	name: "robots",
	title: "Robots",
	type: "array",
	of: [
		{
			type: "object",
			fields: [
				{
					name: "userAgent",
					title: "User Agent",
					type: "string",
				},
				{
					name: "allow",
					title: "Allow",
					type: "string",
				},
				{
					name: "disallow",
					title: "Disallow",
					type: "string",
				},
			],
		},
	],
});
