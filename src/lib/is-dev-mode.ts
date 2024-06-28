export function isDevMode() {
  let isDev = false;
  try {
    isDev = import.meta.env.DEV;
  } catch (error) {}
  return isDev;
}
