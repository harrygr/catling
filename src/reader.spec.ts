import { Reader } from './reader'

type Cat = {
  name: string,
  favoriteFood: string,
}

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'
type Language = 'english' | 'portuguese'
type Store = Record<Language,Record<TimeOfDay,string>>

describe('Reader', () => {

  const garfield = {
    name: 'Garfield',
    favoriteFood: 'Lasagna',
  }

  const catName: Reader<Cat, string> = Reader(cat => cat.name)
  const greetCat: Reader<Cat, string> = catName.map(name => `Hello ${name}`)
  const isGarfield: Reader<Cat, boolean> = catName.map(name => name === 'Garfield')
  const catFavoriteFood: Reader<Cat, string> = catName.flatMap(name => Reader(cat => `${name}'s favorite food is ${cat.favoriteFood}`))

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
    expect(catFavoriteFood.run(garfield)).toBe('Garfield\'s favorite food is Lasagna')
  })
})

describe('Reader example', () => {

  const store = {
    english: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good night',
    },
    portuguese: {
      morning: 'Bom dia',
      afternoon: 'Boa tarde',
      evening: 'Boa tarde',
      night: 'Boa noite',
    }
  }

  function findGreetingsPerLanguage(language: Language): Reader<Store,Record<TimeOfDay,string>> {
    return Reader(store => store[language])
  }

  function findGreetingForTimeOfDay(language: Language, timeOfDay: TimeOfDay): Reader<Store, string> {
    return findGreetingsPerLanguage(language).map(timesOfDay => timesOfDay[timeOfDay])
  }

  function greetPerson(language: Language, timeOfDay: TimeOfDay, name: string): Reader<Store, string> {
    return findGreetingForTimeOfDay(language, timeOfDay).map(greeting => `${greeting} ${name}`)
  }

  it('greets with correct language and with the correct time of day', () => {
    expect(findGreetingForTimeOfDay('english', 'morning').run(store)).toEqual('Good morning')
  })

  it('greets a person with the correct language and with the correct time of day', () => {
    expect(greetPerson('portuguese', 'afternoon', 'Mario').run(store)).toEqual('Boa tarde Mario')
  })

})