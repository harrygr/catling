export interface SemiGroup<A> {
  concat: (a: A) => A
}

export interface Monoid<A> extends SemiGroup<A> {
  empty: () => Monoid<A>
}
