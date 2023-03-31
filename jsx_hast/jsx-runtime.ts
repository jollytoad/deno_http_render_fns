// deno-lint-ignore-file no-explicit-any
import * as r from "hastscript/jsx-runtime";
import type { Child, Properties, Result } from "hastscript";

export const jsx = (type: any, props: any) => {
  if (typeof type === "function") {
    return type(props);
  } else {
    return r.jsx(type, props);
  }
};

export const jsxs = jsx;
export const jsxDEV = jsx;
export const Fragment = r.Fragment;

// deno-lint-ignore no-namespace
export namespace JSX {
  export type Element = Result;

  export interface IntrinsicAttributes {
    key?: any;
  }

  export interface IntrinsicElements {
    [name: string]:
      | Properties
      | {
        children?: Child;
      };
  }

  export interface ElementChildrenAttribute {
    children?: any;
  }
}
