import { Monoid } from './types'

export interface Writer<L extends any, V> {
  value: () => V
  written: () => L
  run: () => [L, V]
  map: <V1>(fn: (value: V) => V1) => Writer<L, V1>
  flatMap: <W1>(fn: (value: V) => Writer<L, W1>) => Writer<L, W1>
  bimap: <W1 extends Monoid<any>, V1>(fn1: (log: L) => W1, fn2: (value: V) => V1) => Writer<W1, V1>
  mapBoth: <L1 extends Monoid<any>, V1>(fn: (log: L, value: V) => [L1, V1]) => Writer<L1, V1>
  reset: () => Writer<L, V>
  swap: <V1 extends (value: V) => any>(fn: V1) => Writer<Monoid<V>, L> // This doesn't work too well in typescript because we can't infer the new
  mapWritten: <K extends Monoid<any>>(fn: (log: L) => K) => Writer<K, V>
}

export function Writer<W extends Monoid<any>, A>(log: W, value: A): Writer<W, A> {
  return {
    value: () => value,
    written: () => log,
    run: () => [log, value],
    map: fn => {
      const nValue = fn(value)
      return Writer<W, typeof nValue>(log, nValue)
    },
    flatMap: fn => {
      const nWriter = fn(value)
      const nValue = nWriter.value()
      const nLog = log.combine(nWriter.written())
      return Writer<W, typeof nValue>(nLog, nWriter.value())
    },
    bimap: (fn1, fn2) => {
      const nValue = fn2(value)
      const nLog = fn1(log)
      return Writer<typeof nLog, typeof nValue>(nLog, nValue)
    },
    mapBoth: fn => {
      const [nLog, nValue] = fn(log, value)
      return Writer<typeof nLog, typeof nValue>(nLog, nValue)
    },
    reset: () => Writer<W, A>(log.empty() as W, value),
    swap: fn => {
      const nLog = fn(value)
      return Writer<typeof nLog, W>(nLog, log)
    },
    mapWritten: fn => {
      const nLog = fn(log)
      return Writer<typeof nLog, A>(nLog, value)
    },
  }
}
