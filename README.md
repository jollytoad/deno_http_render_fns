# deno_http_render_fns

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https://deno.land/x/http_render_fns/mod.ts)

NOTE: This is still fairly experimental.

A collection of functions for rendering documents from a HTTP server, designed
to complement `http_fns`, but can be used with other routers.

## Request Handlers

All functions create a Request handler function of roughly the form:

`(req: Request, data: unknown) => Response | Promise<Response>`

They are intended to be used with [http_fns](https://deno.land/x/http_fns)
functions.

```ts
serve(
  handle([
    byPattern(
      ["/", "/:path*"],
      byMethod({
        GET: mapData(asHomePageProps, renderHTML(HomePage)),
      }),
    ),
  ]),
);

function asHomePageProps(req: Request, match: URLPatternResult): HomePageProps {
  return {
    // Props for the HomePage component
  };
}
```

See the [demo](./demo/serve.tsx) for a full example, which you can also run
using a choice of JSX framework:

```sh
deno task demo:preact
deno task demo:hast
deno task demo:stream
```

### renderJSON

`renderJSON() => (req: Request, data: unknown) => Response`

Renders the given `data` as a JSON body in a Response with the content type of
`application/json`.

### renderHTML

`renderHTML(component: FunctionComponent) => (req: Request, props: unknown) => Response`

Renders a JSX function `component` with the given `props` as a HTML body in a
Response with the content type of `text/html`.

NOTE: This treats JSX purely as a templating language, it only support function
components (ie. not class based), and doesn't support hooks, hydration or other
exotic features beyond the scope of JSX itself.

The choice of JSX runtime and serialization is determined via your import map.

`renderHTML` requires a couple of bare module specifiers to be mapped:

- `"$jsx/serialize.ts"` - module that perform serialization of the JSX runtime
  nodes
- `"$jsx/types.ts"` - provides a `ComponentType` type
- `"$jsx/jsx-runtime"` - the regular JSX runtime module

Your `deno.json` must also be configure to make use of the runtime:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "$jsx"
  }
}
```

(NOTE: the dollar prefix `$jsx` is just to avoid any potential confusion with as
existing npm module).

We provide three flavours of JSX framework here:

#### Preact

This is the recommended framework at present.

Makes use of [Preact](https://preactjs.com/) JSX runtime to build a vdom, and
[preact-render-to-string](https://github.com/preactjs/preact-render-to-string)
to serialize to HTML.

This requires further bare module specifiers, here's an example of a import map
to support this:

```json
{
  "imports": {
    "$jsx/": "https://deno.land/x/http_render_fns/jsx-preact/",
    "$jsx/jsx-runtime": "https://deno.land/x/http_render_fns/jsx-preact/jsx-runtime.ts",

    "preact": "https://esm.sh/preact@10.15.1",
    "preact/": "https://esm.sh/*preact@10.15.1/",
    "preact-render-to-string": "https://esm.sh/*preact-render-to-string@6.1.0"
  }
}
```

#### Hast

Makes use of the [hastscript](https://github.com/syntax-tree/hastscript) JSX
runtime to build a [hast](https://github.com/syntax-tree/hast) syntax tree, and
[hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html) to
serialize to HTML.

This requires further bare module specifiers, here's an example of a import map
to support this:

```json
{
  "imports": {
    "$jsx/": "https://deno.land/x/http_render_fns/jsx-hast/",
    "$jsx/jsx-runtime": "https://deno.land/x/http_render_fns/jsx-hast/jsx-runtime.ts",

    "hastscript": "https://esm.sh/hastscript@7.2.0",
    "hastscript/": "https://esm.sh/hastscript@7.2.0/",
    "hast-util-to-html": "https://esm.sh/hast-util-to-html@8.0.4"
  }
}
```

#### Experimental Async Streaming

**NOT FOR PRODUCTION USE**

This is an **experimental** JSX runtime that renders directly to a stream of
strings. It also supports asynchronous components.

This has been moved into it's own [module](https://deno.land/x/jsx_stream), and
just requires the jsx mappings:

```json
{
  "imports": {
    "$jsx/": "https://deno.land/x/jsx_stream@v0.0.4/",
    "$jsx/jsx-runtime": "https://deno.land/x/jsx_stream@v0.0.4/jsx-runtime.ts"
  }
}
```
