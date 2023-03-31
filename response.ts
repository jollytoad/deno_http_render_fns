/**
 * Create an ok response
 */
export function ok(body?: BodyInit | null, headers?: HeadersInit): Response {
  return new Response(body, {
    status: body ? 200 : 204,
    statusText: body ? "OK" : "No Content",
    headers,
  });
}
