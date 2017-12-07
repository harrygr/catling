import { Option, Some, None } from './option'

describe('Option - None', () => {
  it('gets a string representation of itself', () => {
    expect(None().toString()).toBe('None')
  })
  it('constructs a None from a null or undefined value', () => {
    const option = Option(null)

    expect(option.type).toBe('none')
  })

  it('has a map method that does nothing', () => {
    const fn = jest.fn()
    const option = None().map(fn)

    expect(option.type).toBe('none')
    expect(fn.mock.calls.length).toBe(0)
  })

  it('has a flatMap method', () => {
    const result = None().flatMap(val => `${val}bar`)

    expect(result.type).toBe('none')
  })

  it('implements a fold method', () => {
    const option = None()

    expect(option.fold(() => 'foo', v => v)).toBe('foo')
  })

  it('implements a getOrElse method', () => {
    const option = None()

    expect(option.getOrElse('foo')).toBe('foo')
  })
})

describe('Option - Some', () => {
  it('gets a string representation of itself', () => {
    expect(Some('foo').toString()).toBe('Some(foo)')
  })

  it('constructs a Some from a value', () => {
    const option = Option('hello, world')

    expect(option.get()).toBe('hello, world')
  })

  it('has a map method that operates on the value', () => {
    const option = Option('hello').map(s => s.length)

    expect(option.get()).toBe(5)
  })

  it('has a flatMap method', () => {
    const result = Some('foo').flatMap(val => `${val}bar`)

    expect(result).toBe('foobar')
  })

  it('returns a None if the map method results in undefined or null', () => {
    const option = Option('hello').map(() => null)

    expect(option.type).toBe('none')
  })

  it('implements a fold method', () => {
    const option = Some('hello')

    expect(option.fold(() => 'foo', v => v)).toBe('hello')
  })

  it('implements a getOrElse method', () => {
    const option = Some('hello')

    expect(option.getOrElse('foo')).toBe('hello')
  })
})
