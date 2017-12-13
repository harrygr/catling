import { List } from './list'

export interface Writer<W, T> {
  run: () => [List<W>, T]
  value: () => T
  written: () => List<W>
  inspect: () => string
  flatMap: <K>(fn: (val: T) => Writer<W, K>) => Writer<W, K>
}

export function Writer<W, T>(log: List<W>, val: T): Writer<W, T> {
  return {
    inspect: () => `Writer(${log},${val})`,
    run: () => [log, val],
    value: () => val,
    written: () => log,
    flatMap: fn => {
      const newWriter = fn(val)
      return Writer(log.concat(newWriter.written()), newWriter.value())
    },
  }
}
