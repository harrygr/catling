export interface Reader<T, U> {
  map: <K>(fn: (ctx: U) => K) => Reader<T, K>
  flatMap: <K>(fn: (value: U) => Reader<T, K>) => Reader<T, K>
  chain: <K>(fn: (value: U) => Reader<T, K>) => Reader<T, K>
  run: (ctx: T) => U
}

export function Reader<T, U>(run: (ctx: T) => U): Reader<T, U> {
  const flatMap: Reader<T, U>['flatMap'] = fn => Reader(value => fn(run(value)).run(value))

  return {
    map: fn => Reader(value => fn(run(value))),
    flatMap,
    chain: flatMap,
    run: ctx => run(ctx),
  }
}
