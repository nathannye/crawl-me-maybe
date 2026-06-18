import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";

const externals = [
	"react",
	"react-dom",
	"react/jsx-runtime",
	"sanity",
	"@sanity/ui",
	"react-icons",
	"@sanity-image/url-builder",
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
if (existsSync(".dist/index.css"))
	renameSync(".dist/index.css", "dist/index.css");

rmSync(".dist", { recursive: true });

console.log("Built dist/index.js (ESM)");
