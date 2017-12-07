import { Option, None } from './option'
import { returnVoid, wrap } from './utils'

export interface Either<L, R> {
  toString: () => string
  map<B>(fn: (value: R) => B): Either<L, B>
  leftMap<B>(fn: (value: L) => B): Either<B, R>
  flatMap<B>(fn: (value: R) => Either<L, B>): Either<L, B>
  right(): R | void
  left(): L | void
  toOption: () => Option<R>
  fold<B>(acc: B): (fn: (acc: B, value: R) => B) => B
  foldLeft<B>(acc: B): (fn: (acc: B, value: L) => B) => B
}

export interface Right<T> extends Either<any, T> {}

export const Either = {
  right: Right,
  left: Left,
}

export function Right<T>(val: T): Right<T> {
  return {
    toString: () => `Right(${val})`,
    map: fn => Right(fn(val)),
    leftMap: () => Right(val),
    flatMap: fn => fn(val),
    right: () => val,
    left: returnVoid,
    toOption: () => Option(val),
    fold: acc => fn => fn(acc, val),
    foldLeft: wrap,
  }
}

export interface Left<T> extends Either<T, any> {}

export function Left<T>(val: T): Left<T> {
  return {
    toString: () => `Left(${val})`,
    map: () => Left(val),
    leftMap: fn => Left(fn(val)),
    flatMap: () => Left(val),
    right: returnVoid,
    left: () => val,
    toOption: None,
    fold: wrap,
    foldLeft: acc => fn => fn(acc, val),
  }
}
