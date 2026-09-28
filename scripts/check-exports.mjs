#!/usr/bin/env node
// Fails the build when a bundle lists a name in its `export { ... }` block
// without defining or importing it. Bun 1.3+ produces bundles like this when
// the package's `sideEffects` setting covers the entry file.
import { readFileSync } from "node:fs";

const files = process.argv.slice(2);

if (files.length === 0) {
	console.error("Usage: check-exports <bundle.js> [...more]");
	process.exit(1);
}

const escapeRegExp = (value) => value.replace(/[$]/g, "\\$&");

let failed = false;

for (const file of files) {
	const source = readFileSync(file, "utf8");
	const exportBlocks = [...source.matchAll(/^export\s*\{([^}]*)\}/gm)];

	if (exportBlocks.length === 0 && !/^export\s/m.test(source)) {
		console.error(`${file}: no exports found`);
		failed = true;
		continue;
	}

	const localNames = exportBlocks.flatMap((match) =>
		match[1]
			.split(",")
			.map((entry) => entry.trim().split(/\s+as\s+/)[0])
			.filter(Boolean),
	);

	const missing = localNames.filter((name) => {
		const escaped = escapeRegExp(name);
		const declared = new RegExp(
			`(?:function\\*?|var|let|const|class)\\s+${escaped}\\b`,
		);
		const imported = new RegExp(`^import[^;]*\\b${escaped}\\b[^;]*from`, "m");
		return !declared.test(source) && !imported.test(source);
	});

	if (missing.length > 0) {
		console.error(`${file}: exported but never defined: ${missing.join(", ")}`);
		failed = true;
	} else {
		console.log(`${file}: ${localNames.length} exports OK`);
	}
}

process.exit(failed ? 1 : 0);
