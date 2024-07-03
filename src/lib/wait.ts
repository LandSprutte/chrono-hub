export const wait = (ms?: number) =>
  new Promise((resolve) => setTimeout(resolve, ms ?? 250));
