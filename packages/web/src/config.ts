// packages/core/src/config.ts
export interface SanityWebConfig {
	projectId?: string;
	dataset?: string;
}

let config: SanityWebConfig = {};

/** Initialize or override config */
export function setConfig(newConfig: SanityWebConfig) {
	config = { ...config, ...newConfig };
}

/** Read the active config anywhere */
export function getConfig(): SanityWebConfig {
	return config;
}
