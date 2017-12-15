import { Writer } from './writer'
import { List } from './list'

describe('Writer', () => {
  it('maps two writers together, preserving their logs', () => {
    const writer = Writer(List('a'), 1)
    const writer2 = writer.flatMap(val => Writer(List('b'), val + 1))
    expect(writer2.value()).toBe(2)
    expect(writer2.written().head()).toBe('a')
    expect(
      writer2
        .written()
        .tail()
        .head(),
    ).toBe('b')
  })
  it('transforms logs and values using bimap', () => {
    const writer = Writer(List('a'), 1)
    const writer2 = writer.bimap(logs => List(logs.length()), values => values.toString())
    expect(writer2.value()).toBe('1')
    expect(writer2.written().head()).toBe(1)
  })
  it('transforms logs and values using mapboth', () => {
    const writer = Writer(List('a'), 1)
    const writer2 = writer.mapBoth((logs, values) => [List(logs.length()), values.toString()])
    expect(writer2.value()).toBe('1')
    expect(writer2.written().head()).toBe(1)
  })
  it('empties the logs using reset', () => {
    const writer = Writer(List('a'), 1)
    const writer2 = writer.reset()
    expect(writer2.written().head()).toBe(undefined)
  })
  it('swaps the writer using swap', () => {
    const writer = Writer(List('a'), 1)
    const writer2 = writer.swap(value => List(value))
    expect(writer2.written().combine).toBeDefined()
  })
  it('maps the writer using mapWritten', () => {
    const writer = Writer(List('a'), 1)
    const writer2 = writer.mapWritten(w => w.combine(List('b')))
    expect(
      writer2
        .written()
        .tail()
        .head(),
    ).toBe('b')
  })
})
