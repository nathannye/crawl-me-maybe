import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";

const externals = [
	"@sanity/client",
	"@sanity-image/url-builder",
	"@sanity/image-url",
];

rmSync("dist", { recursive: true, force: true });

const result = await Bun.build({
	entrypoints: ["src/index.ts"],
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

renameSync(".dist/index.js", "dist/index.js");
if (existsSync(".dist/index.js.map"))
	renameSync(".dist/index.js.map", "dist/index.js.map");

rmSync(".dist", { recursive: true });

console.log("Built dist/index.js (ESM)");
