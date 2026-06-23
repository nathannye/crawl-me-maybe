export const normalizeUrl = (baseUrl: string, path: string) => {
	return new URL(path, baseUrl).toString();
};
