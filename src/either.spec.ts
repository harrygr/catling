import { Left, Right } from './either'

describe('Either', () => {
  describe('Right', () => {
    it('it constructs a Right', () => {
      const either = Right('foo')
      expect(either.right()).toBe('foo')
    })

    it('maps over a right', () => {
      const right = Right('foo').map(s => s.length)

      expect(right.right()).toBe(3)
    })
    it('left maps over a right with no effect', () => {
      const right = Right('foo').leftMap(s => s.length)

      expect(right.right()).toBe('foo')
    })
    it('folds over the value', () => {
      const result = Right('foo').fold(-1)((acc, val) => acc + val.length)

      expect(result).toBe(2)
    })

    it('folds left over the value', () => {
      const result = Right('foo').foldLeft(-1)((acc, val) => acc + val.length)

      expect(result).toBe(-1)
    })
  })

  describe('Left', () => {
    it('it constructs a Left', () => {
      const either = Left('gah')
      expect(`${either}`).toBe('Left(gah)')
    })

    it('maps over a left with no effect', () => {
      const right = Left('foo').map(s => s.length)

      expect(right.left()).toBe('foo')
    })

    it('left maps over a left', () => {
      const left = Left('gah').leftMap(s => s.length)

      expect(left.left()).toBe(3)
    })

    it('folds over the value', () => {
      const result = Left('foo').fold(-1)((acc, val) => acc + val.length)

      expect(result).toBe(-1)
    })
    it('folds left over the value', () => {
      const result = Left('foo').foldLeft(-1)((acc, val) => acc + val.length)

      expect(result).toBe(2)
    })
  })
})
