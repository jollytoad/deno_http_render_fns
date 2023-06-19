import { streamNode } from "./_stream_node.ts";
import { readableStreamFromIterable } from "https://deno.land/std@0.191.0/streams/readable_stream_from_iterable.ts";
import type { JSX } from "./jsx-runtime.ts";

export function renderBody(node: JSX.Element): BodyInit {
  return readableStreamFromIterable(streamNode(node)).pipeThrough(new TextEncoderStream());
}
