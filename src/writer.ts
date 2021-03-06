import { Semigroup } from './semigroup'

export interface Writer<W extends Semigroup<W>, T> {
  run: () => [W, T]
  value: () => T
  written: () => W
  inspect: () => string
  flatMap: <K>(fn: (val: T) => Writer<W, K>) => Writer<W, K>
  chain: <K>(fn: (val: T) => Writer<W, K>) => Writer<W, K>
  map: <K>(fn: (val: T) => K) => Writer<W, K>
  // bit of a hack as TS can't seem to infer the returned log type
  mapWritten: <L extends Semigroup<any>>(fn: (log: W) => L) => Writer<L, T>
  bimap: <L extends Semigroup<any>, K>(logFn: (log: W) => L, valFn: (val: T) => K) => Writer<L, K>
  mapBoth: <L extends Semigroup<any>, K>(fn: (log: W, val: T) => [L, K]) => Writer<L, K>
}

export function Writer<W extends Semigroup<W>, T>(log: W, val: T): Writer<W, T> {
  const flatMap = fn => {
    const w = fn(val)
    return Writer(log.concat(w.written()), w.value())
  }
  return {
    inspect: () => `Writer(${log},${val})`,
    run: () => [log, val],
    value: () => val,
    written: () => log,
    flatMap,
    chain: flatMap,
    map: fn => Writer(log, fn(val)),
    mapWritten: fn => Writer(fn(log), val),
    bimap: (logFn, valFn) => Writer(logFn(log), valFn(val)),
    mapBoth: fn => {
      const [l, v] = fn(log, val)
      return Writer(l, v)
    },
  }
}
