export interface SanityWebConfig {
    projectId?: string;
    dataset?: string;
}
/** Initialize or override config */
export declare function setConfig(newConfig: SanityWebConfig): void;
/** Read the active config anywhere */
export declare function getConfig(): SanityWebConfig;
