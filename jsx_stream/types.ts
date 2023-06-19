// deno-lint-ignore-file no-explicit-any
export type StreamableNode = null | string | Iterable<string> | AsyncIterable<string>;
export type Promisable<T> = T | PromiseLike<T>;
export type ComponentType<P = Properties> = (props: P) => Promisable<StreamableNode>;
export type Children = any;
export type Properties = Record<string, unknown>;
export type AwaitedRecord<P> = {
  [K in keyof P]: Awaited<P[K]>;
}
export type TagName = string;
export type AttrName = string;