import { createClient, defineQuery } from "next-sanity";

export const client = createClient({
  projectId: "ci0kxvte",
  dataset: "production",
  apiVersion: "2026-06-21",
  useCdn: false,
});

export const getDocumentByType = async (
  type: string,
  options?: {
    projection?: string;
    filter?: string;
    params?: Record<string, unknown>;
  },
) => {
  const query = defineQuery(
    `*[_type == "${type}" ${options?.filter || ""}] ${options?.projection || "[0]{...}"}`,
  );
  const documents = await client.fetch(query, options?.params || {});
  return documents;
};

export const getDocumentBySlug = async (
  type: string,
  slug: string,
  options?: {
    projection?: string;
    filter?: string;
    params?: Record<string, unknown>;
  },
) => {
  const query = defineQuery(
    `*[_type == "${type}" && slug.current == "${slug}" ${options?.filter || ""}] ${options?.projection || "[0]{...}"}`,
  );
  const documents = await client.fetch(query, options?.params || {});
  return documents;
};
