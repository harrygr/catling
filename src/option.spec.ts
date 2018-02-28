import { Option, Some, None } from './option'

describe('Option', () => {
  it('constructs a None from a null or undefined value', () => {
    const option = Option(null)

    expect(option.type).toBe('none')
  })

  it('casts a non-null argument to a some of itself', () => {
    function castToOption(arg: string | null | undefined) {
      const result = Option(arg).map(s => s.length)
      return result
    }

    expect(castToOption('foo').get()).toBe(3)
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
      const result = None().flatMap(val => Some(`${val}bar`))

      expect(result.type).toBe('none')
    })

    it('implements a fold method', () => {
      const option = None()

      expect(option.fold(() => 'foo')(v => v)).toBe('foo')
    })

    it('implements a getOrElse method', () => {
      const option = None()

      expect(option.getOrElse('foo')).toBe('foo')
    })

    it("states that it's a some", () => {
      expect(Some('foo').isSome()).toBe(true)
    })
  })

  describe('Some', () => {
    it('gets a string representation of itself', () => {
      expect(`${Some('foo')}`).toBe('Some("foo")')
      expect(`${Some(5)}`).toBe('Some(5)')
    })

    it('asserts it is a some', () => {
      expect(Some('foo').isSome()).toBe(true)
    })

    it('has a map method that operates on the value', () => {
      const option = Some('hello').map(s => s.length)

      expect(option.get()).toBe(5)
    })

    it('implements a flatMap method', () => {
      const result = Some('foo').flatMap(val => Some(`${val}bar`))

      expect(result.get()).toBe('foobar')
    })

    it('returns a None if the map method results in undefined or null', () => {
      const option = Option('hello').map(() => null)

      expect(option.type).toBe('none')
    })

    it('implements a fold method', () => {
      const option = Some('hello')

      expect(option.fold(() => 'foo')(v => v)).toBe('hello')
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

    it("states that it's not a some", () => {
      expect(None().isSome()).toBe(false)
    })
  })

  describe('utils', () => {
    it('asserts if a value is an Option', () => {
      expect(Option.isOption(None())).toBe(true)
      expect(Option.isOption(Some('foo'))).toBe(true)
      expect(Option.isOption('foo')).toBe(false)
      expect(Option.isOption({ foo: 'bar' })).toBe(false)
    })

    it('returns a single option for checking several options', () => {
      expect(Option.all([Some('foo'), Some('bar')]).get()).toEqual(['foo', 'bar'])
      expect(Option.all([Some('foo'), Some(1)]).get()).toEqual(['foo', 1])

      expect(Option.all([Some('foo'), None()]).isSome()).toBe(false)

      const f = Option.all([Some('foo'), null, Some('bar'), Some(55)])
      expect(f.isSome()).toBe(false)
    })

    it('coerces a list of values into an option of that list', () => {
      expect(Option.all([1, 2, 3, 4, 5]).get()).toEqual([1, 2, 3, 4, 5])
      expect(Option.all([1, 2, 3, null, 5]).isSome()).toBe(false)
    })
  })
})
