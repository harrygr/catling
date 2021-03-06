import { Writer } from './writer'
import { List } from './list'

describe('Writer', () => {
  it('constructs a writer', () => {
    const writer = Writer(List('a message'), 42)
    expect(writer.value()).toBe(42)
    expect(writer.written().head()).toBe('a message')
  })

  it('flat maps 2 writers together, preserving their logs', () => {
    const writer = Writer(List('z'), 30).flatMap(a => {
      return Writer(List('a', 'b'), 12 + a)
    })

    expect(writer.written().toArray()).toEqual(['z', 'a', 'b'])
    expect(writer.value()).toBe(42)
  })

  it('flat maps 2 writers with an string log', () => {
    const writer = Writer('first', 'foo').flatMap(word => {
      return Writer('second', word.toUpperCase())
    })

    expect(writer.run()).toEqual(['firstsecond', 'FOO'])
  })

  it('maps over a writer', () => {
    const writer = Writer('first', 5).map(n => n + 5)

    expect(writer.run()).toEqual(['first', 10])
  })

  it('maps over the written part of the writer to something of the same type', () => {
    const writer = Writer('something', 'foo').mapWritten(log => {
      return log.toUpperCase()
    })

    expect(writer.written()).toEqual('SOMETHING')
  })

  it('maps over the written part of the writer to something of a different type', () => {
    const writer = Writer('something', 'foo').mapWritten(log => {
      return List(log)
    })

    expect(writer.written().toArray()).toEqual(['something'])
  })

  it('bimaps over a writer', () => {
    const writer = Writer(List('a', 'b'), 27).bimap(
      log => log.map(l => l.toUpperCase()).toArray(),
      res => res * 100,
    )

    expect(writer.written()).toEqual(['A', 'B'])
    expect(writer.value()).toBe(2700)
  })

  it('maps over both params', () => {
    const writer = Writer(List('a', 'b'), 27).mapBoth((log, res) => [
      log.map(l => l.toUpperCase()).toArray(),
      res * 100,
    ])

    expect(writer.written()).toEqual(['A', 'B'])
    expect(writer.value()).toBe(2700)
  })

  it('inspects a writer', () => {
    const writer = Writer('foo', 15)

    expect(writer.inspect()).toBe('Writer(foo,15)')
  })
})
