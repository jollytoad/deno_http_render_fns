/**
 * Create a handler that renders the first context arg as JSON data in a Response.
 */
export function renderJSON() {
  return (_req: Request, data: unknown) =>
    new Response(JSON.stringify(data), {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
      },
    });
}
