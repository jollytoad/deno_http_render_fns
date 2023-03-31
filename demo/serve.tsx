import {
  byMethod,
  byPattern,
  handle,
  mapData,
  renderHTML,
  serve,
} from "./deps.ts";

await serve(
  handle([
    byPattern(
      ["/", "/:path*"],
      byMethod({
        GET: mapData(asHomePageProps, renderHTML(HomePage)),
      }),
    ),
  ]),
  {
    port: 3456,
  },
);

interface HomePageProps {
  baseURL: string;
  message: string;
}

function HomePage({ baseURL, message }: HomePageProps) {
  return (
    <body>
      <h1>Home</h1>
      <p>{message}</p>
      <p>Try some other urls:</p>
      <ul>
        <li>
          <a href={baseURL}>Home</a>
        </li>
        <li>
          <a href={new URL("/foo", baseURL).href}>Foo</a>
        </li>
        <li>
          <a href={new URL("/foo/bar", baseURL).href}>Foo Bar</a>
        </li>
      </ul>
    </body>
  );
}

function asHomePageProps(req: Request, match: URLPatternResult) {
  const baseURL = new URL(req.url);
  baseURL.pathname = "";
  return {
    baseURL: baseURL.href,
    message: `You are here: ${match.pathname.input}`,
  };
}
