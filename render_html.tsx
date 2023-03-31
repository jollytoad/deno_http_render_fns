import { renderToString } from "$jsx/serialize.ts";
import type { ComponentType } from "$jsx/types.ts";
import { ok } from "./response.ts";

// deno-lint-ignore ban-types
export function renderHTML<P extends {}>(
  Component: ComponentType<P>,
  headers?: Record<string, string>,
) {
  return (_req: Request, props: P): Response => {
    const start = performance.now();

    const vnode = <Component {...props} />;

    const out = renderToString(vnode);

    const end = performance.now();

    const body = new Blob([
      "<!DOCTYPE html>\n",
      out,
    ]);

    console.log("Render took:", end - start, "ms");

    return ok(body, {
      "Content-Type": "text/html; charset=utf-8",
      ...headers,
    });
  };
}
