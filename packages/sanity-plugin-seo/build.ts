import {
	existsSync,
	mkdirSync,
	readFileSync,
	renameSync,
	rmSync,
	writeFileSync,
} from "node:fs";

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

if (existsSync(".dist/index.css")) {
	const css = readFileSync(".dist/index.css", "utf-8");
	const injection = `
(function() {
  var id = "__crawl-me-maybe-seo-styles__";
  if (typeof document === "undefined" || document.getElementById(id)) return;
  var style = document.createElement("style");
  style.id = id;
  style.textContent = ${JSON.stringify(css)};
  document.head.appendChild(style);
})();
`;
	const js = readFileSync("dist/index.js", "utf-8");
	writeFileSync("dist/index.js", injection + js);
}

rmSync(".dist", { recursive: true });

console.log("Built dist/index.js (ESM)");
