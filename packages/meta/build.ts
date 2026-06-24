import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

const externals = ["next", "zhead"];

rmSync("dist", { recursive: true, force: true });

const result = await Bun.build({
	entrypoints: ["src/index.ts", "src/next.ts", "src/nuxt.ts"],
	outdir: ".dist",
	format: "esm",
	sourcemap: "external",
	external: externals,
	minify: false,
});

if (!result.success) {
	for (const log of result.logs) console.error(log);
	process.exit(1);
}

mkdirSync("dist", { recursive: true });

for (const file of readdirSync(".dist")) {
	renameSync(join(".dist", file), join("dist", file));
}

rmSync(".dist", { recursive: true });

console.log("Built dist/index.js, dist/next.js, dist/nuxt.js (ESM)");
