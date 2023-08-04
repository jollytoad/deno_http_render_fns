import { renderBody } from "$jsx/serialize.ts";
import type { ComponentType, RenderOptions } from "$jsx/types.ts";

const DOCTYPE = "<!DOCTYPE html>\n";
const ENCODED_DOCTYPE = new TextEncoder().encode(DOCTYPE);

let streamDelay = 0;

// deno-lint-ignore ban-types
export function renderHTML<P extends {}>(
  Component: ComponentType<P>,
  headers?: Record<string, string>,
  options?: RenderOptions,
) {
  return async (_req: Request, props: P): Promise<Response> => {
    const start = performance.now();

    const vnode = <Component {...props} />;

    let bodyInit: BodyInit = await renderBody(vnode, options);

    if (isData(bodyInit)) {
      return new Response(bodyInit, {
        status: 200,
        statusText: "OK",
        headers
      });
    } else if (isStream(bodyInit)) {
      const reader = bodyInit.getReader();

      bodyInit = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(ENCODED_DOCTYPE);
        },
        async pull(controller) {
          const { value, done } = await reader.read();
          if (done) {
            controller.close();
            logTiming("Stream");
          } else {
            controller.enqueue(value);
            if (streamDelay) {
              await new Promise((resolve) => setTimeout(resolve, streamDelay));
            }
          }
        },
      });
    } else {
      bodyInit = new Blob([
        DOCTYPE,
        bodyInit,
      ]);

      logTiming("Blob");
    }

    return new Response(bodyInit, {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        ...headers,
      }
    });

    function logTiming(note?: string) {
      const end = performance.now();
      console.debug("Render took:", end - start, "ms", note);
    }
  };
}

function isStream(bodyInit: BodyInit): bodyInit is ReadableStream<Uint8Array> {
  return !!bodyInit && typeof bodyInit === "object" &&
    "getReader" in bodyInit && typeof bodyInit.getReader === "function";
}

function isData(bodyInit: BodyInit): bodyInit is FormData | URLSearchParams {
  return bodyInit instanceof FormData || bodyInit instanceof URLSearchParams;
}

export function delayStream(delay: number) {
  streamDelay = delay;
}
