# Catling 🔫🐈

[![CircleCI](https://img.shields.io/circleci/project/github/harrygr/catling.svg?style=flat-square)](https://circleci.com/gh/harrygr/catling) [![npm](https://img.shields.io/npm/v/catling.svg?style=flat-square)](https://www.npmjs.com/package/catling) [![codecov](https://codecov.io/gh/harrygr/catling/branch/master/graph/badge.svg)](https://codecov.io/gh/harrygr/catling)



A monad library in TypeScript

Use monads in your code for functional programming joy.

Catling is influenced by the Scala standard library and [Cats][cats]

## Installation

Install using yarn or npm

yarn:

```
yarn add catling
```

npm:

```
npm install catling --save
```

## API

### Option

An option is a great way to represent a value which may or may not exist. An option is either a `Some` or a `None`.

```typescript
import { Option } from 'catling'

const name: Option<string> = getParameter(data, 'name')

const upper = name
  .map(trim)
  .filter(n => n.length !== 0)
  .map(n => n.toUpperCase())

console.log(upper) // either "Some("JIMMY")" or "None"
```

#### map

Applies the function given to the value if it's a Some, otherwise return None.

```typescript
const amount = Option(10).map(x => x * 2)

// Some(20)
```

#### flatMap

Applies the function that maps the value in the Option to a new Option.

```typescript
const age = Option(people[0])
  .flatMap(person => Option(person.age))

// Some(20) or None
```

#### filter

Returns the Option if the predicate returns true, otherwise return a None.

```typescript
const age1 = Option(16).filter(a => a > 18) // None
const age2 = Option(21).filter(a => a > 18) // Some(21)
```


#### fold / chain

Applies the first function if the Option is a None, else applies the second function.

```typescript
const name = Option('Jimmy').fold(
  () => 'NONAME',
  n => n.toUpperCase()
)

// 'JIMMY'
```

#### get

Returns the value of the Option if it's a Some, otherwise return `undefined`

```typescript
const name = Option('Jimmy').get()

// 'Jimmy'
```

#### getOrElse

Returns the value of the Option if it's a Some, otherwise return the alternative.

```typescript
const name = Option(undefined).getOrElse('Bob')


// 'Bob'
```

### Either

An either represents a value consisting of one of two possible types.
It's typically used to represent the result of something that may fail. Eithers are right-biased.

```typescript
import { Either, Left, Right } from 'catling'

function divide(divisor: number, n: number): Either<string, number> {
  if (divisor === 0) {
    return Left('Cannot divide by zero')
  } else {
    return Right(n / divisor)
  }
}

const myNum1 = divide(5, 10)
                .map(n => n + 20)

console.log(myNum1) // "Right(22)"

const myNum2 = divide(0, 10)
                .map(n => n + 20)

console.log(myNum2) // "Left("Cannot divide by zero")"
```

### Immutable List

An immutable list behaves much like the native array, expect it cannot be mutated.

```typescript
import { List } from 'catling'

const result = List(1, 2, 4, 5)
                .map(double)
                .filter(greaterThan3)
                .fold(0, add)

console.log(result) // 22
```

### Writer

A writer is a context that carries with it some sort of log with its computation.

```typescript
import { Writer, List } from 'catling'

const myWriter = Writer(List('initial value'), 10)
                  .flatMap(val => Writer(List('adding 5'), val + 5)
                  .flatMap(val => Writer(List('doubling'), val * 2)

console.log(myWriter) // Writer(List(initial value, adding 5, doubling), 30)
```

The log part of the writer must be a semigroup according to the [fantasy-land spec][fantasy-land-semigroup], meaning it must have a `concat` method. This is used to combine the logs from the source writer.


[cats]: https://github.com/typelevel/cats
[fantasy-land-semigroup]: https://github.com/fantasyland/fantasy-land#semigroup