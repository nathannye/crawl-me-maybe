import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	outExtension({ format }) {
		return {
			js: format === "cjs" ? ".cjs" : ".js",
		};
	},
	dts: true,
	splitting: false,
	sourcemap: false,
	clean: true,
	treeshake: true,
	outDir: "dist",
	tsconfig: "tsconfig.json",
	skipNodeModulesBundle: true,
	minify: "terser",
	platform: "node",
	target: "node18",
	shims: true,
});
