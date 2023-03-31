import type { Child, Properties, Result } from "hastscript";

// deno-lint-ignore ban-types
export type ComponentType<P = {}> = (props: P) => Result;
export type Children = Child;
export type { Properties };
