import { writeFileSync } from "node:fs";
import path from "node:path";

export const createFile = (
	outputPath: string,
	filename: string,
	content: string,
): void => {
	try {
		writeFileSync(path.join(outputPath, filename), content);
	} catch (err) {
		throw new Error(
			`Failed to write file ${filename} to ${outputPath}: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
};
