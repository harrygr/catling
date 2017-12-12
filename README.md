# Catling 🔫🐈

[![CircleCI](https://circleci.com/gh/harrygr/catling.svg?style=svg)](https://circleci.com/gh/harrygr/catling) [![npm](https://img.shields.io/npm/v/catling.svg)](https://www.npmjs.com/package/catling)

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
const name: Option<string> = getParameter(request, 'name')

const upper = name
  .map(trim)
  .filter(n => n.length !== 0)
  .map(n => n.toUpperCase())

console.log(upper) // Prints either "Some("JIMMY")" or "None"
```

### Either

An either represents a value consisting of one of two possible types.
It's typically used to represent the result of something that may fail. Eithers are right-biased.

```typescript
function divide(divisor: number, n: number): Either<string, number> {
  if (divisor === 0) {
    return Left('Cannot divide by zero')
  } else {
    return Right(n / divisor)
  }
}

const myNum1 = divide(5, 10)
.map(n => n + 20)

console.log(myNum1) // Prints "Right(22)"

const myNum2 = divide(0, 10)
.map(n => n + 20)

console.log(myNum2) // Prints "Left("Cannot divide by zero")"
```

### Immutable List

Docs to come

[cats]: https://github.com/typelevel/cats