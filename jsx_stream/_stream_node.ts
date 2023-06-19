import { isAsyncIterable, isIterable, isPromiseLike } from "./_guards.ts";
import type { Promisable, StreamableNode } from "./types.ts";

export async function* streamNode(node: Promisable<StreamableNode>): AsyncIterable<string> {
  if (typeof node === "string") {
    yield node;
  } else if (isPromiseLike(node)) {
    yield* streamNode(await node);
  } else if (isIterable(node) || isAsyncIterable(node)) {
    yield* node;
  }
}
