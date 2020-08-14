import { Left, Right, tryCatch, Either } from './either'
import { List } from './list'

describe('Either', () => {
  describe('tryCatch', () => {
    it("returns an Right from a function that doesn't throw", () => {
      const result = tryCatch(() => 'foo')

      expect(result.right()).toBe('foo')
    })

    it('returns a Left from a function that throws', () => {
      const err = new Error('something bad happened')

      const result = tryCatch(() => {
        throw err
      })

      expect(result.left()).toEqual(err)
    })
  })

  describe('fromPromise', () => {
    it('returns a Promise<Right> for a promise that resolves', async () => {
      const result = await Either.fromPromise(Promise.resolve('hello'))

      expect(result.right()).toBe('hello')
    })

    it('returns a Promise<Left> for a promise that rejects', async () => {
      const err = new Error('Something bad happened')
      const result = await Either.fromPromise(Promise.reject(new Error('Something bad happened')))

      expect(result.left()).toEqual(err)
    })
  })

  describe('Right', () => {
    it('gets a string representation of itself', () => {
      expect(Right('foo').toString()).toBe('Right("foo")')
      expect(Right(7).toString()).toBe('Right(7)')
    })

    it('it constructs a Right', () => {
      const either = Right('foo')
      expect(either.right()).toBe('foo')
    })

    it('maps over a right', () => {
      const either = Right('foo').map((s) => s.length)
      expect(either.right()).toBe(3)
    })

    it('flatMaps over its value', () => {
      const either = Right('foo').flatMap(() => Right(3))

      expect(either.right()).toBe(3)
    })

    it('left maps over a right with no effect', () => {
      const either = Right('foo').leftMap((s) => s.length)
      expect(either.right()).toBe('foo')
    })

    it('folds over the value', () => {
      const result = Right('foo').fold(
        (e) => `failed with ${e}`,
        (v) => `succeeded with ${v}`,
      )
      expect(result).toBe('succeeded with foo')
    })

    it('implements a toArray method', () => {
      expect(Right('foo').toArray()).toEqual(['foo'])
    })

    it('implements a toList method', () => {
      expect(Right('foo').toList().toString()).toEqual(List('foo').toString())
    })

    it('implements a toPromise method', async () => {
      const promise1 = Right('foo').toPromise()
      // it should flatten promises
      const promise2 = Right(Promise.resolve('bar')).toPromise()

      expect(await promise1).toBe('foo')
      expect(await promise2).toBe('bar')
    })

    it('maps with an async function', async () => {
      const name = Either.tryCatch(() => 'bob')
      const greetAsync = (name: string) => Promise.resolve(`hello, ${name}`)

      const result = name.mapAsync(greetAsync)

      await result.then((greeting) => expect(greeting.right()).toBe('hello, bob'))
    })
  })

  describe('Left', () => {
    it('it constructs a Left', () => {
      const either = Left('gah')
      expect(`${either}`).toBe('Left("gah")')
    })

    it('maps over a left with no effect', () => {
      const either = Left('foo').map((s) => s.length)
      expect(either.left()).toBe('foo')
    })

    it('flatMaps over a left with no effect', () => {
      const either = Left('gah').flatMap(() => Right(3))

      expect(either.left()).toBe('gah')
    })

    it('asyncMaps with over a left with no effect', async () => {
      const err = new Error('Oh no')
      const either = Left(err)
      const greetAsync = (name: string) => Promise.resolve(`hello, ${name}`)

      const result = either.mapAsync(greetAsync)

      await result.then((greeting) => expect(greeting.left()).toEqual(err))
    })

    it('leftMaps over a left', () => {
      const either = Left('gah').leftMap((s) => s.length)
      expect(either.left()).toBe(3)
    })

    it('folds over the value', () => {
      const result = Left('gah').fold(
        (e) => `failed with ${e}`,
        (v) => `succeeded with ${v}`,
      )
      expect(result).toBe('failed with gah')
    })

    it('implements a toArray method', () => {
      expect(Left('foo').toArray()).toEqual([])
    })

    it('implements a toList method', () => {
      expect(Left('foo').toList().toString()).toEqual(List().toString())
    })

    it('implements a toPromise method', () => {
      const error = new Error('oh no!')

      return Left(error)
        .toPromise()
        .then(() => Promise.reject('this should not happen'))
        .catch((err) => expect(err).toBe(error))
    })
  })
})
