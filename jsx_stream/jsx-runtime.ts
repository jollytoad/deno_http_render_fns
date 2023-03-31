// deno-lint-ignore-file no-explicit-any
import voidElements from "./void-elements.ts";

// IMPORTANT: This is UNSAFE experimental code, do not use in production.

export function* jsx(type: any, props: any): Iterable<string> {
  // console.group(type);

  if (typeof type === "function") {
    yield* type(props);
  } else {
    const { children, ...attrs } = props && typeof props === "object"
      ? props
      : {} as any;

    if (type === null) {
      yield* ch(children);
    } else if (isValidTag(type)) {
      yield "<";
      yield type;
      for (const [name, value] of Object.entries(attrs)) {
        if (isValidAttr(name) && value !== false) {
          yield " ";
          yield name;

          if (value !== true) {
            yield '="';
            yield encodeValue(value);
            yield '"';
          }
        }
      }

      if (voidElements.has(type)) {
        // Although self-closing tags are ignored in HTML5, they are required in XML/XHTML/SVG,
        // and it does no harm adding them, and makes void elements more obvious when debugging output.
        yield "/>";
      } else {
        yield ">";

        yield* ch(children);

        yield "</";
        yield type;
        yield ">";
      }
    }
  }

  // console.groupEnd();
}

function isValidTag(tag: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9\-]*$/.test(tag);
}

function isValidAttr(name: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9\-]*$/.test(name);
}

function encodeValue(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function* ch(children: any): Iterable<string> {
  if (typeof children === "boolean" || typeof children === "number") {
    yield String(children);
  } else if (typeof children === "string") {
    yield children;
  } else if (typeof children?.[Symbol.iterator] === "function") {
    for (const child of children) {
      yield* ch(child);
    }
  }
}

export const jsxs = jsx;
export const jsxDEV = jsx;
export const Fragment = null;

// deno-lint-ignore no-namespace
export namespace JSX {
  export type Element = Iterable<string>;

  export interface IntrinsicAttributes {
    key?: any;
  }

  export interface IntrinsicElements {
    [name: string]: any;
  }

  export interface ElementChildrenAttribute {
    children?: any;
  }
}
