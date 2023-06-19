import { escape as escape_ } from "https://deno.land/std@0.191.0/html/entities.ts";

class SafeString extends String {
}

export function safe(value: unknown): string {
  return new SafeString(value) as string;
}

export function escape(value: unknown): string {
  return safe(escape_(String(value)));
}

export function isSafe(value: unknown): boolean {
  return value instanceof SafeString;
}
