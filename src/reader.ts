export interface Reader<T, U> {
  map<K>(fn: (value: U) => K): Reader<T, K>,
  flatMap<K>(fn: (value: U) => Reader<T, K>): Reader<T, K>,
  run:(config: T) => U
}

export function Reader<T, U>(run: (ctx: T) => U): Reader<T, U> {
  return {
    map: function(fn) {
      return Reader(value => fn(run(value)))
    },
    flatMap: function (fn) {
      return Reader(value => fn(run(value)).run(value))
    },
    run: config => run(config)
  }
}
