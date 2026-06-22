import type { Thing, WithContext } from "schema-dts";
type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};
export type BuilderInput<T extends Thing> = Simplify<Omit<T, "@type" | "@context">>;
export type SchemaBuilder<T extends Thing> = (input: BuilderInput<T>) => WithContext<T>;
export declare function defineBuilder<T extends Thing>(type: string): SchemaBuilder<T>;
export {};
