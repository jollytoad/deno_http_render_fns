import { streamNode } from "./_stream_node.ts";
import type { ComponentType, Properties } from "./types.ts";

export async function* streamComponent(component: ComponentType, props: Properties): AsyncIterable<string> {
  yield* streamNode(component(props));
}
