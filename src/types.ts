export interface Functor<A> {
  map: <B>(a: A) => Functor<B>
}

export interface Monoid<A> extends SemiGroup<A> {
  empty: () => Monoid<A>
}

export interface SemiGroup<A> {
  combine: (a: A) => A
}
