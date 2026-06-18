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

const esm = await Bun.build({
	entrypoints: ["src/index.ts"],
	outdir: ".dist-esm",
	format: "esm",
	sourcemap: "external",
	external: externals,
	minify: false,
});

if (!esm.success) {
	for (const log of esm.logs) console.error(log);
	process.exit(1);
}

const cjs = await Bun.build({
	entrypoints: ["src/index.ts"],
	outdir: ".dist-cjs",
	format: "cjs",
	external: externals,
	minify: false,
});

if (!cjs.success) {
	for (const log of cjs.logs) console.error(log);
	process.exit(1);
}

mkdirSync("dist", { recursive: true });

renameSync(".dist-esm/index.js", "dist/index.js");
renameSync(".dist-cjs/index.js", "dist/index.cjs");
if (existsSync(".dist-esm/index.js.map"))
	renameSync(".dist-esm/index.js.map", "dist/index.js.map");
if (existsSync(".dist-esm/index.css"))
	renameSync(".dist-esm/index.css", "dist/index.css");

rmSync(".dist-esm", { recursive: true });
rmSync(".dist-cjs", { recursive: true });

console.log("Built dist/index.js (ESM) and dist/index.cjs (CJS)");
