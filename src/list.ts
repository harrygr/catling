import { Option } from './option'

export interface List<T> {
  toArray: () => T[]
  toString: () => string
  map: <K>(fn: (item: T) => K) => List<K>
  filter: (fn: (el: T) => boolean) => List<T>
  length: () => number
  concat: (list2: List<T>) => List<T>
  flatMap: <K>(fn: (item: T) => List<K>) => List<K>
  fold: <K>(initial: K) => (fn: (acc: K, el: T) => K) => K
  head: () => T | undefined
  headOption: () => Option<T>
  tail: () => List<T>
}

export function List<T>(...items: T[]): List<T> {
  return {
    toArray: () => items,
    toString: () => `List(${items})`,
    map: fn => List(...items.map(fn)),
    filter: fn => List(...items.filter(fn)),
    length: () => items.length,
    concat: list2 => List(...items, ...list2.toArray()),
    flatMap: <K>(fn) => List(...items).fold(List<K>())((acc, i) => acc.concat(fn(i))),
    fold: initial => fn => items.reduce(fn, initial),
    head: () => items[0],
    headOption: () => Option(items[0]),
    tail: () => List(...items.slice(1)),
}
