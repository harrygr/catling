import { Reader } from './reader'

describe('Reader', () => {

  type Cat = {
    name: string,
    favoriteFood: string,
  }

  const garfield = {
    name: 'Garfield',
    favoriteFood: 'Lasagna',
  }

  const catName: Reader<Cat, string> = Reader(cat => cat.name)
  const greetCat: Reader<Cat, string> = catName.map(name => `Hello ${name}`)
  const isGarfield: Reader<Cat, boolean> = catName.map(name => name === 'Garfield')
  const catFavoriteFood: Reader<Cat, string> = catName.flatMap(name => Reader(cat => `${name}'s food is ${cat.favoriteFood}`))

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
    expect(catFavoriteFood.run(garfield)).toBe('Garfield\'s food is Lasagna')
  })
})

describe('Reader example', () => {

  type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'
  type Language = 'english' | 'portuguese'
  type User = {
    name: string,
    language: Language
  }

  const englishGreetings: Record<TimeOfDay, string> = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    night: 'Good night',
  }

  const portugueseGreetings: Record<TimeOfDay, string> = {
    morning: 'Bom dia',
    afternoon: 'Boa tarde',
    evening: 'Boa tarde',
    night: 'Boa noite',
  }

  const greetingNameInLanguage = function(timeOfDay: TimeOfDay): Reader<User, string> {
    return Reader(user => user.language === 'english' ? englishGreetings[timeOfDay] : portugueseGreetings[timeOfDay])
  }

  const capitalize: Reader<User, string> = Reader(user => user.name.charAt(0).toUpperCase() + user.name.slice(1))

  const greetPerson = function (greeting: string): Reader<User, string> {
    return capitalize.map(capitalizedName => {
      return `${greeting} ${capitalizedName}`
    })
  }

  const greetPersonInLanguage = function(timeOfDay: TimeOfDay) {
    return greetingNameInLanguage(timeOfDay).flatMap(greetPerson)
  }

  it('greets person in correct language', () => {
    expect(greetPersonInLanguage('evening').run({
      name: "Dan",
      language: "english"
    })).toEqual('Good evening Dan')
  })

  it('greets person in correct language with fixed capitalization', () => {
    expect(greetPersonInLanguage('morning').run({
      name: "mario",
      language: "portuguese"
    })).toEqual('Bom dia Mario')
  })

})