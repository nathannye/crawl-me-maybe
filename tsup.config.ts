import { defineConfig } from "tsup";
import fs from "node:fs";
import path from "node:path";

/**
 * Utility to create per-package configs
 * @param pkg - package name inside /packages/
 * @param externals - deps that should not be bundled
 */
function pkgConfig(pkg: string, externals: string[] = []) {
	const entry = `packages/${pkg}/src/index.ts`;
	const outDir = `packages/${pkg}/dist`;

	return defineConfig({
		entry: [entry],
		format: ["esm", "cjs"],
		dts: true,
		splitting: false,
		sourcemap: true,
		clean: true,
		treeshake: true,
		outDir,
		external: [...externals, ...Object.keys(readPkgDeps(pkg))],
		// ensure each package has its own tsconfig paths
		tsconfig: `packages/${pkg}/tsconfig.json`,
		skipNodeModulesBundle: true,
		minify: false,
	});
}

/**
 * Reads package.json dependencies to mark them external
 */
function readPkgDeps(pkg: string) {
	const pkgPath = path.resolve(`packages/${pkg}/package.json`);
	if (!fs.existsSync(pkgPath)) return {};
	const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
	return {
		...pkgJson.dependencies,
		...pkgJson.peerDependencies,
	};
}

export default [
	// Sitemap plugin
	pkgConfig("sitemap"),

	// Sanity plugin (depends on react + sanity)
	pkgConfig("sanity-seo", ["react", "sanity"]),

	// Web utilities and schema markup
	pkgConfig("web"),
];
