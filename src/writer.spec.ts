import { Writer } from './writer'
import { List } from './list'

describe('Writer', () => {
  it('constructs a writer', () => {
    const writer = Writer(List('a message'), 42)
    expect(writer.value()).toBe(42)
    expect(writer.written().head()).toBe('a message')
  })

  it('maps 2 writers together, preserving their logs', () => {
    const writer = Writer(List('z'), 30).flatMap(a => {
      return Writer(List('a', 'b'), 12 + a)
    })

    expect(writer.written().toArray()).toEqual(['z', 'a', 'b'])
    expect(writer.value()).toBe(42)
  })
})
