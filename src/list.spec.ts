import { List } from './list'

describe('List', () => {
  it('constructs a list from an array', () => {
    const myList = List(...[1, 2, 3])
    expect(myList.toArray()).toEqual([1, 2, 3])
  })

  it('returns a string representation', () => {
    expect(List(1, 2, 3).toString()).toBe('List(1,2,3)')
  })

  it('gets the length of the list', () => {
    expect(List(1, 1, 5).length()).toBe(3)
  })

  it('filters a list', () => {
    expect(
      List(1, 2, 10, 20)
        .filter(x => x > 5)
        .toArray(),
    ).toEqual([10, 20])

    const things = List<unknown>(1, 2, 4, 'a', 'b')
    const filteredThings = things.filter((n): n is number => typeof n === 'number')
    expect(filteredThings.toArray()).toEqual([1, 2, 4])
  })

  it('maps over a list', () => {
    const myList = List(1, 2, 3)
    expect(myList.map(x => x * 2).toArray()).toEqual([2, 4, 6])
  })

  it('concats 2 lists', () => {
    expect(
      List(1, 2)
        .concat(List(3, 4))
        .toArray(),
    ).toEqual([1, 2, 3, 4])
  })

  it('folds a list', () => {
    const myList = List(1, 2, 3)

    expect(myList.fold(0, (acc, el) => el + acc)).toBe(6)
  })

  it('flat maps over a list', () => {
    const myList = List('ga', 'fp')
    const fn = (i: string) => List(...i.split(''))

    expect(myList.flatMap(fn).toArray()).toEqual(['g', 'a', 'f', 'p'])
  })

  it('gets the head of the list', () => {
    expect(List(1, 2, 4).head()).toBe(1)
  })

  it('gets the head of the list as an option', () => {
    expect(
      List()
        .headOption()
        .toString(),
    ).toBe('None')
    expect(
      List(1, 2, 4)
        .headOption()
        .toString(),
    ).toBe('Some(1)')
  })

  it('gets the tail of the list', () => {
    expect(
      List(1, 2, 3)
        .tail()
        .toArray(),
    ).toEqual([2, 3])
  })

  it('finds the first element in a list for a predicate', () => {
    const myList = List(1, 2, 3, 5)

    expect(myList.find(v => v > 2).get()).toBe(3)
  })

  it("Returns a None for when finding an element that doesn't exist", () => {
    const myList = List(1, 2, 3, 5)

    expect(myList.find(v => v > 10).isSome()).toBe(false)
  })

  it('Checks of an element exists in the list according to a predicate', () => {
    const myList = List(1, 2, 3, 4)

    expect(myList.contains(v => v > 3)).toBe(true)
    expect(myList.contains(v => v > 10)).toBe(false)
  })

  it('chains according to the fantasyland spec (associativity)', () => {
    const myList = List(1, 2, 3, 4)
    const repeat = (n: number) => List(n, n)
    const add1 = (n: number) => List(n + 1)

    expect(
      myList
        .chain(repeat)
        .chain(add1)
        .toArray(),
    ).toEqual(myList.chain(x => repeat(x).chain(add1)).toArray())
  })
})
