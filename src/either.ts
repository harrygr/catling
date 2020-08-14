import { Option, None } from './option'
import { returnVoid, returnEmptyArray } from './utils'
import { List } from './list'

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
  toArray(): R[]
  toList(): List<R>
  toPromise(): Promise<R>
  fold: <K>(leftFn: (left: L) => K, rightFn: (right: R) => K) => K
  mapAsync: <K>(fn: (value: R) => Promise<K>) => Promise<Either<L, K>>
}

export const tryCatch = <T, E = unknown>(fn: () => T): Either<E, T> => {
  try {
    return Right(fn())
  } catch (err) {
    return Left(err)
  }
}

export const fromPromise = async <T, E = unknown>(promise: Promise<T>): Promise<Either<E, T>> =>
  promise.then(Right).catch((err: E) => Left(err))

export const Either = {
  right: Right,
  left: Left,
  tryCatch,
  fromPromise,
}

export interface Right<T> extends Either<any, T> {}

export function Right<T>(val: T): Right<T> {
  const inspect = () => `Right(${JSON.stringify(val)})`
  const flatMap = (fn) => fn(val)
  return {
    toString: inspect,
    inspect,
    map: (fn) => Right(fn(val)),
    leftMap: () => Right(val),
    flatMap,
    chain: flatMap,
    right: () => val,
    left: returnVoid,
    toOption: () => Option(val),
    toArray: () => [val],
    toList: () => List(val),
    toPromise: () => Promise.resolve(val),
    fold: (_, fn) => fn(val),
    mapAsync: (fn) => fromPromise(fn(val)),
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
    leftMap: (fn) => Left(fn(val)),
    flatMap: flatMap,
    chain: flatMap,
    right: returnVoid,
    left: () => val,
    toOption: None,
    toArray: returnEmptyArray,
    toList: () => List(),
    toPromise: () => Promise.reject(val),
    fold: (fn) => fn(val),
    mapAsync: () => Promise.resolve(Left(val)),
  }
}
