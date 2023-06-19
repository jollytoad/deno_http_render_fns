import { isAsyncIterable, isIterable, isPromiseLike } from "./_guards.ts";
import { isSafe, escape } from "./_safe.ts";
import type { Children } from "./types.ts";

export async function* streamFragment(children: Children): AsyncIterable<string> {
  if (isSafe(children)) {
    yield children;
  } else if (typeof children === "string" || typeof children === "boolean" || typeof children === "number") {
    yield escape(children);
  } else if (isPromiseLike(children)) {
    yield* streamFragment(await children);
  } else if (isIterable(children)) {
    for (const child of children) {
      yield* streamFragment(child);
    }
  } else if (isAsyncIterable(children)) {
    for await (const child of children) {
      yield* streamFragment(child);
    }
  }
}
