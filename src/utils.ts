export function call<T>(fn: () => T): T {
  return fn()
}

export function identity<T>(val: T): T {
  return val
}

export function returnFalse() {
  return false
}

export function returnVoid() {}

export function wrap<T>(val: T) {
  return () => val
}
