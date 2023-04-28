import { Notebook } from "../types";

export function timestampSortFn(a: Notebook, b: Notebook) {
  let { updated: first } = a.timestamps;
  let { updated: second } = b.timestamps;

  if (first === second) return 0;
  if (first < second) return 1;
  return -1;
}
