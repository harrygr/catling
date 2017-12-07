import { Option, Some, None, isOption } from './option'

describe('Option', () => {
  it('constructs a None from a null or undefined value', () => {
    const option = Option(null)

    expect(option.type).toBe('none')
  })

  it('constructs a Some from a value', () => {
    const option = Option('hello, world')
    expect(option.type).toBe('some')
    expect(option.get()).toBe('hello, world')
  })

  describe('None', () => {
    it('gets a string representation of itself', () => {
      expect(`${None()}`).toBe('None')
    })

    it('asserts it is not a some', () => {
      expect(Some('foo').isSome()).toBe(true)
    })

    it('implements a map method that does nothing', () => {
      const fn = jest.fn()
      const option = None().map(fn)

      expect(option.type).toBe('none')
      expect(fn.mock.calls.length).toBe(0)
    })

    it('implements a flatMap method', () => {
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

  describe('Some', () => {
    it('gets a string representation of itself', () => {
      expect(`${Some('foo')}`).toBe('Some(foo)')
    })

    it('asserts it is a some', () => {
      expect(Some('foo').isSome()).toBe(true)
    })

    it('has a map method that operates on the value', () => {
      const option = Some('hello').map(s => s.length)

      expect(option.get()).toBe(5)
    })

    it('implements a flatMap method', () => {
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

    it('implements a filter method', () => {
      const option = Some('hello')

      expect(option.filter(v => v.length > 10).type).toBe('none')
      expect(option.filter(v => v.length < 10).type).toBe('some')
    })

    it('implements a getOrElse method', () => {
      const option = Some('hello')

      expect(option.getOrElse('foo')).toBe('hello')
    })
  })

  describe('utils', () => {
    it('asserts if a value is an Option', () => {
      expect(isOption(None())).toBe(true)
      expect(isOption(Some('foo'))).toBe(true)
      expect(isOption('foo')).toBe(false)
      expect(isOption({ foo: 'bar' })).toBe(false)
    })
  })
})
