export function renderToString(iter: Iterable<string>): string {
  const a: string[] = [];
  for (const s of iter) {
    a.push(s);
  }
  return a.join("");
}
