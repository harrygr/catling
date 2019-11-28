import { F, T, returnVoid, identity, returnUndefined, returnEmptyArray } from './utils'
import { List } from './list'

/**
 * Represents optional values. Instances of `Option` are an instance of `Some` or `None`.
 *
 * @typeparam T  The type of the value in the option
 */
export interface Option<T> {
  type: 'some' | 'none'
  isSome(): boolean
  get(): T | undefined

  /**
   * Returns a Some containing the result of applying `fn` to this Option's value if this
   * Option is nonempty.
   * @param fn the function to apply
   */
  map<K>(fn: (value: T) => K): Option<K>

  /**
   * Returns the result of applying `fn` to this Option's value if this Option is nonempty.
   * Returns a None if this Option is empty. Slightly different from map in that `fn` is expected
   * to return an Option (which could be a None).
   * @param fn
   */
  flatMap<K>(fn: (value: T) => Option<K>): Option<K>
  chain<K>(fn: (value: T) => Option<K>): Option<K>

  /**
   * Returns the result of applying `fn` to this Option's value if the Option is nonempty. Otherwise, evaluates expression `ifEmpty`.
   * @param ifEmpty
   * @param fn
   */
  fold<K>(ifEmpty: () => K, fn: (value: T) => K): K

  /**
   * Returns this Option if it is nonempty and applying the predicate `p` to this Option's value returns true.
   * Otherwise, return a None.
   *
   * @param p the predicate used for testing
   */
  filter<S extends T>(p: (value: T) => value is S): Option<S>

  /**
   * Returns this Option if it is nonempty and applying the predicate `p` to this Option's value returns true.
   * Otherwise, return a None.
   *
   * @param p the predicate used for testing
   */
  filter(p: (value: T) => boolean): Option<T>

  /**
   * Returns the option's value if the option is nonempty, otherwise return `alternative`.
   * @param alternative
   */
  getOrElse<K>(alternative: K): T | K
  toString(): string

  /**
   * Unary List of optional value, otherwise a empty List
   */
  toList: () => List<T>
  inspect(): string
  forEach(fn: (value: T) => any): void

  /**
   * Unary Array of optional value, otherwise an empty array
   */
  toArray(): T[]
}

export interface Some<T> extends Option<T> {
  type: 'some'
  get: () => T
}

export function Some<T>(value: T): Some<T> {
  const inspect = () => `Some(${JSON.stringify(value)})`
  const flatMap = <K>(fn: (value: T) => Option<K>) => fn(value)

  return {
    type: 'some',
    isSome: T,
    get: () => value,
    map: fn => Some(fn(value)),
    flatMap,
    chain: flatMap,
    fold: (_, fn) => fn(value),
    filter: fn => (fn(value) ? Some(value) : None()),
    getOrElse: () => value,
    toString: inspect,
    toList: () => List(value),
    inspect,
    forEach: fn => {
      fn(value)
    },
    toArray: () => [value],
  }
}

export interface None extends Option<never> {
  type: 'none'
  get: () => undefined
}

export function None(): None {
  const inspect = () => 'None'
  return {
    type: 'none',
    isSome: F,
    get: returnUndefined,
    map: None,
    flatMap: None,
    chain: None,
    fold: fn => fn(),
    filter: None,
    getOrElse: identity,
    toString: inspect,
    toList: () => List(),
    inspect,
    forEach: returnVoid,
    toArray: returnEmptyArray,
  }
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export type MaybeOption<T> = T | Option<T> | null | undefined

export interface OptionFactory {
  <T>(value: T | null | undefined): Option<T>
  isOption(value: any): value is Option<{}>
  all<T1>(options: [MaybeOption<T1>]): Option<[T1]>
  all<T1, T2>(options: [MaybeOption<T1>, MaybeOption<T2>]): Option<[T1, T2]>
  all<T1, T2, T3>(
    options: [MaybeOption<T1>, MaybeOption<T2>, MaybeOption<T3>],
  ): Option<[T1, T2, T3]>
  all<T1, T2, T3, T4>(
    options: [MaybeOption<T1>, MaybeOption<T2>, MaybeOption<T3>, MaybeOption<T4>],
  ): Option<[T1, T2, T3, T4]>
  all<T1, T2, T3, T4, T5>(
    options: [MaybeOption<T1>, MaybeOption<T2>, MaybeOption<T3>, MaybeOption<T4>, MaybeOption<T5>],
  ): Option<[T1, T2, T3, T4, T5]>
  all<T1, T2, T3, T4, T5, T6>(
    options: [
      MaybeOption<T1>,
      MaybeOption<T2>,
      MaybeOption<T3>,
      MaybeOption<T4>,
      MaybeOption<T5>,
      MaybeOption<T6>,
    ],
  ): Option<[T1, T2, T3, T4, T5, T6]>
  all<T1, T2, T3, T4, T5, T6, T7>(
    options: [
      MaybeOption<T1>,
      MaybeOption<T2>,
      MaybeOption<T3>,
      MaybeOption<T4>,
      MaybeOption<T5>,
      MaybeOption<T6>,
      MaybeOption<T7>,
    ],
  ): Option<[T1, T2, T3, T4, T5, T6, T7]>

  all<T>(options: MaybeOption<T>[]): Option<T[]>
}

const OptionFactory = (<T>(value: T | null | undefined): Option<T> => {
  return isDefined(value) ? Some(value) : None()
}) as OptionFactory

function isOption(value: any): value is Option<{}> {
  return value && (value.type === 'some' || value.type === 'none')
}

OptionFactory.isOption = isOption

OptionFactory.all = (things: any[]): any => {
  const values = things.map(thing => (isOption(thing) ? thing.get() : thing))

  return values.every(isDefined) ? Some(values) : None()
}

export const Option = OptionFactory
