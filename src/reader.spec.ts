import { Reader } from './reader'
import { Option } from './option'

type Cat = {
  name: string
  favoriteFood: string
}

type Db = {
  users: Record<string, string>
  passwords: Record<string, string>
}

describe('Reader', () => {
  const garfield = {
    name: 'Garfield',
    favoriteFood: 'Lasagna',
  }

  const catName: Reader<Cat, string> = Reader(cat => cat.name)
  const greetCat: Reader<Cat, string> = catName.map(name => `Hello ${name}`)
  const isGarfield: Reader<Cat, boolean> = catName.map(name => name === 'Garfield')
  const catFavoriteFood: Reader<Cat, string> = catName.flatMap(name =>
    Reader(cat => `${name}'s favorite food is ${cat.favoriteFood}`),
  )

  it('executes run with a single reader', () => {
    expect(catName.run(garfield)).toBe('Garfield')
  })

  it('executes with a double reader using intermediate map', () => {
    expect(greetCat.run(garfield)).toBe('Hello Garfield')
  })

  it('executes with a double reader using intermediate map and different types', () => {
    expect(isGarfield.run(garfield)).toBe(true)
  })

  it('has a flatmap method', () => {
    expect(catFavoriteFood.run(garfield)).toBe("Garfield's favorite food is Lasagna")
  })
})

describe('Reader example', () => {
  function findUserName(userId: string): Reader<Db, Option<string>> {
    return Reader(db => Option(db.users[userId]))
  }

  function checkPassword(username: string, password: string): Reader<Db, boolean> {
    return Reader(db => db.passwords[username] === password)
  }

  function checkLogin(userId: string, password: string): Reader<Db, boolean> {
    return findUserName(userId).flatMap(usernameOption => {
      return usernameOption
        .map(username => checkPassword(username, password))
        .getOrElse(Reader(() => false))
    })
  }

  const users = {
    '1': 'mario',
    '2': 'link',
    '3': 'donkey kong',
  }

  const passwords = {
    mario: 'mushroom',
    link: 'sword',
    'donkey kong': 'banana',
  }

  const db = { users, passwords }

  it('finds username', () => {
    expect(
      findUserName('1')
        .run(db)
        .get(),
    ).toEqual('mario')
    expect(
      findUserName('4')
        .run(db)
        .get(),
    ).toBeUndefined()
  })

  it('checks password', () => {
    expect(checkPassword('mario', 'mushroom').run(db)).toBeTruthy()
    expect(checkPassword('mario', 'something').run(db)).toBeFalsy()
  })

  it('returns true for an existing user', () => {
    expect(checkLogin('1', 'mushroom').run(db)).toBeTruthy()
    expect(checkLogin('2', 'sword').run(db)).toBeTruthy()
    expect(checkLogin('3', 'banana').run(db)).toBeTruthy()
  })

  it('returns false for a user that does not exist', () => {
    expect(checkLogin('4', 'something').run(db)).toBeFalsy()
  })

  it('returns false for a mismatch between user and password', () => {
    expect(checkLogin('2', 'something').run(db)).toBeFalsy()
  })
})
