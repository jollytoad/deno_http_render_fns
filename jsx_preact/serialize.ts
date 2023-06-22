import { renderToString } from "preact-render-to-string";
import type { VNode } from "preact";
import type { RenderOptions } from "./types.ts";

export function renderBody(vnode: VNode, options?: RenderOptions) {
  return renderToString(vnode, options?.context);
}
