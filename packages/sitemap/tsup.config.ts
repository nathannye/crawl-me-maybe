import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
	treeshake: true,
	outDir: "dist",
	external: ["minify-xml"],
	tsconfig: "tsconfig.json",
	skipNodeModulesBundle: true,
	minify: false,
});
