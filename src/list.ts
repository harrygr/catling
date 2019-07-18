import { Option } from './option'
import { Monoid } from './monoid'

export interface List<T> extends Monoid<List<T>> {
  toArray: () => T[]
  toString: () => string
  inspect: () => string
  map: <K>(fn: (item: T) => K) => List<K>
  filter: (fn: (el: T) => boolean) => List<T>
  length: () => number
  flatMap: <K>(fn: (item: T) => List<K>) => List<K>
  chain: <K>(fn: (item: T) => List<K>) => List<K>
  fold: <K>(initial: K, fn: (acc: K, el: T) => K) => K
  head: () => T | undefined
  headOption: () => Option<T>
  tail: () => List<T>
  find: (p: (item: T) => boolean) => Option<T>
  contains: (p: (item: T) => boolean) => boolean
}

export function List<T>(...items: T[]): List<T> {
  const inspect = () => `List(${items})`
  const flatMap = <K>(fn) => List(...items).fold(List<K>(), (acc, i) => acc.concat(fn(i)))

  return {
    toArray: () => items,
    toString: inspect,
    inspect,
    map: fn => List(...items.map(fn)),
    filter: fn => List(...items.filter(fn)),
    length: () => items.length,
    concat: list2 => List(...items, ...list2.toArray()),
    flatMap,
    chain: flatMap,
    fold: (initial, fn) => items.reduce(fn, initial),
    head: () => items[0],
    headOption: () => Option(items[0]),
    tail: () => List(...items.slice(1)),
    empty: () => List(),
    find: p => Option(items.reduce((acc, curr) => (acc ? acc : p(curr) ? curr : acc), undefined)),
    contains: p => items.reduce((acc, curr) => (acc ? acc : p(curr)), false),
  }
}
