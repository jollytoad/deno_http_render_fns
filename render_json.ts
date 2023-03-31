import { ok } from "./response.ts";

/**
 * Create a handler that renders the first context arg as JSON data in a Response.
 */
export function renderJSON() {
  return (_req: Request, data: unknown) =>
    ok(JSON.stringify(data), {
      "Content-Type": "application/json",
    });
}
