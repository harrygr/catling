export interface Semigroup<T> {
  concat: (a: T) => T
}
