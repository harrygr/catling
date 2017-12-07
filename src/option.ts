import { returnFalse, returnVoid, identity } from './utils'

export interface Option<T> {
  type: 'some' | 'none'
  isSome: () => boolean
  get: () => T | void
  map: <K>(fn: (value: T) => K) => Option<K>
  flatMap: <K>(fn: (value: T) => Option<K>) => Option<K>
  fold: <K>(leftFn: () => K) => (rightFn: (value: T) => K) => K
  filter: (fn: (value: T) => boolean) => Option<T>
  getOrElse: <K>(alternative: K) => T | K
  toString: () => string
}

export function Option<T>(value: T): Option<T> {
  return value === null || value === undefined ? None() : Some(value)
}

export interface Some<T> extends Option<T> {
  type: 'some'
  get: () => T
}

export function Some<T>(value: T): Some<T> {
  return {
    type: 'some',
    isSome: () => true,
    get: () => value,
    map: fn => Option(fn(value)),
    flatMap: fn => fn(value),
    fold: () => fn => fn(value),
    filter: fn => (fn(value) ? Some(value) : None()),
    getOrElse: () => value,
    toString: () => `Some(${value})`,
  }
}

export interface None extends Option<never> {
  type: 'none'
  get: () => void
}

export function None(): None {
  return {
    type: 'none',
    isSome: returnFalse,
    get: returnVoid,
    map: None,
    flatMap: None,
    fold: fn => () => fn(),
    filter: None,
    getOrElse: identity,
    toString: () => 'None',
  }
}

export function isOption<T>(value: any): value is Option<T> {
  return value && (value.type === 'some' || value.type === 'none')
}
