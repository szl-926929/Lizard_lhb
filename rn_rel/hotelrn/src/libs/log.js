export function log() {
  if (__DEV__) {
    console.log(...arguments);
  }
}

export function warn() {
  if (__DEV__) {
    console.warn(...arguments);
  }
}
