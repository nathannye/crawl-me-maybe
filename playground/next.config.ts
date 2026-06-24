import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: [
		"@crawl-me-maybe/meta",
		"@crawl-me-maybe/schema",
		"@crawl-me-maybe/sitemap",
	],
};

export default nextConfig;
