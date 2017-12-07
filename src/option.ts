export interface Option<T> {
  type: 'some' | 'none'
  get: () => T | void
  map<K>(fn: (value: T) => K): Option<K>
  flatMap<K>(fn: (value: T) => K | None)
  fold<K, P>(leftFn: () => K, rightFn: (value: T) => P): K | P
  getOrElse<K>(alternative: K): T | K
  toString: () => string
}

export function Option<T>(value: T): Option<T> {
  return value === null || value === undefined ? None() : Some(value)
}

export interface None extends Option<never> {
  type: 'none'
  get: () => void
}

export interface Some<T> extends Option<T> {
  type: 'some'
  get: () => T
}

export function Some<T>(value: T): Some<T> {
  return {
    type: 'some',
    get: () => value,
    map: fn => Option(fn(value)),
    flatMap: fn => fn(value),
    fold: (_, rightFn) => rightFn(value),
    getOrElse: () => value,
    toString: () => `Some(${value})`,
  }
}

export function None(): None {
  return {
    type: 'none',
    get: () => {},
    map: None,
    flatMap: None,
    fold: leftFn => leftFn(),
    getOrElse: alternative => alternative,
    toString: () => 'None',
  }
}
