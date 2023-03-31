// deno-lint-ignore-file no-explicit-any ban-types
export type ComponentType<P = {}> = (props: P) => Iterable<string>;
export type Children = any;
export type Properties = any;
