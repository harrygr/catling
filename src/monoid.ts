import { Semigroup } from './semigroup'

export interface Monoid<T> extends Semigroup<T> {
  empty: () => T
}
