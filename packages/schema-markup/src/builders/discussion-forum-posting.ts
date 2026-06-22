import type { DiscussionForumPosting } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildDiscussionForumPosting: SchemaBuilder<DiscussionForumPosting> =
	defineBuilder<DiscussionForumPosting>("DiscussionForumPosting");
