import type { ProfilePage } from "schema-dts";
import { defineBuilder, type SchemaBuilder } from "../define-builder";

export const buildProfilePage: SchemaBuilder<ProfilePage> =
	defineBuilder<ProfilePage>("ProfilePage");
