import { Option, None } from './option'
import { returnVoid } from './utils'

export interface Either<L, R> {
  toString: () => string
  inspect: () => string
  map: <K>(fn: (value: R) => K) => Either<L, K>
  leftMap: <K>(fn: (value: L) => K) => Either<K, R>
  flatMap: <K>(fn: (value: R) => Either<L, K>) => Either<L, K>
  chain: <K>(fn: (value: R) => Either<L, K>) => Either<L, K>
  right(): R | void
  left(): L | void
  toOption: () => Option<R>
  fold: <K>(leftFn: (left: L) => K) => (rightFn: (right: R) => K) => K
}

export interface Right<T> extends Either<any, T> {}

export const Either = {
  right: Right,
  left: Left,
}

export function Right<T>(val: T): Right<T> {
  const inspect = () => `Right(${JSON.stringify(val)})`
  const flatMap = fn => fn(val)
  return {
    toString: inspect,
    inspect,
    map: fn => Right(fn(val)),
    leftMap: () => Right(val),
    flatMap,
    chain: flatMap,
    right: () => val,
    left: returnVoid,
    toOption: () => Option(val),
    fold: () => fn => fn(val),
  }
}

export interface Left<T> extends Either<T, any> {}

export function Left<T>(val: T): Left<T> {
  const inspect = () => `Left(${JSON.stringify(val)})`
  const flatMap = () => Left(val)
  return {
    toString: inspect,
    inspect,
    map: () => Left(val),
    leftMap: fn => Left(fn(val)),
    flatMap: flatMap,
    chain: flatMap,
    right: returnVoid,
    left: () => val,
    toOption: None,
    fold: fn => () => fn(val),
  }
}
