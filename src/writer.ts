import { Monoid } from './types'

export interface Writer<W extends any, A> {
  value: () => A
  written: () => W
  run: () => [W, A]
  map: <K>(fn: (value: A) => K) => Writer<W, K>
  flatMap: <K>(fn: (value: A) => Writer<W, K>) => Writer<W, K>
  bimap: <W1 extends Monoid<any>, A1>(fn1: (w: W) => W1, fn2: (a: A) => A1) => Writer<W1, A1>
  mapBoth: <W1 extends Monoid<any>, A1>(fn: (w: W, a: A) => [W1, A1]) => Writer<W1, A1>
  reset: () => Writer<W, A>
  swap: <V1 extends (val: A) => any>(fn: V1) => Writer<Monoid<A>, W> // This doesn't work too well in typescript because we can't infer the new
  mapWritten: <K extends Monoid<any>>(fn: (writer: W) => K) => Writer<K, A>
}

export function Writer<W extends Monoid<any>, A>(writer: W, value: A): Writer<W, A> {
  return {
    value: () => value,
    written: () => writer,
    run: () => [writer, value],
    map: fn => {
      const val = fn(value)
      return Writer<W, typeof val>(writer, val)
    },
    flatMap: fn => {
      const nWriter = fn(value)
      const nVal = nWriter.value()
      const nLeft = writer.concat(nWriter.written())
      return Writer<W, typeof nVal>(nLeft, nWriter.value())
    },
    bimap: (fn1, fn2) => {
      const nVal = fn2(value)
      const nLeft = fn1(writer)
      return Writer<typeof nLeft, typeof nVal>(nLeft, nVal)
    },
    mapBoth: fn => {
      const [nLeft, nVal] = fn(writer, value)
      return Writer<typeof nLeft, typeof nVal>(nLeft, nVal)
    },
    reset: () => Writer<W, A>(writer.empty() as W, value),
    swap: fn => {
      const nLeft = fn(value)
      return Writer<typeof nLeft, W>(nLeft, writer)
    },
    mapWritten: fn => {
      const left = fn(writer)
      return Writer<typeof left, A>(left, value)
    },
  }
}
