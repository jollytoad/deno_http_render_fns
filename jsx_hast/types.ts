import type { Child, Properties, Result } from "hastscript";
export type { Options as RenderOptions } from "hast-util-to-html";

// deno-lint-ignore ban-types
export type ComponentType<P = {}> = (props: P) => Result;
export type Children = Child;
export type { Properties };
