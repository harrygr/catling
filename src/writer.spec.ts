import { Writer } from './writer'
import { List } from './list'

describe('Writer', () => {
  it('constructs a writer', () => {
    const writer = Writer(List('a message'), 42)
    expect(writer.value()).toBe(42)
    expect(writer.written().head()).toBe('a message')
  })

  it('flat maps 2 writers together, preserving their logs', () => {
    const writer = Writer(List('z'), 30).flatMap(a => {
      return Writer(List('a', 'b'), 12 + a)
    })

    expect(writer.written().toArray()).toEqual(['z', 'a', 'b'])
    expect(writer.value()).toBe(42)
  })

  it('flat maps 2 writers with an string log', () => {
    const writer = Writer('first', 'foo').flatMap(word => {
      return Writer('second', word.toUpperCase())
    })

    expect(writer.run()).toEqual(['firstsecond', 'FOO'])
  })

  it('maps over a writer', () => {
    const writer = Writer('first', 5).map(n => n + 5)

    expect(writer.run()).toEqual(['first', 10])
  })

  it('maps over the written part of the writer to something of the same type', () => {
    const writer = Writer('something', 'foo').mapWritten(log => {
      return log.toUpperCase()
    })

    expect(writer.written()).toEqual('SOMETHING')
  })

  it('maps over the written part of the writer to something of a different type', () => {
    const writer = Writer('something', 'foo').mapWritten(log => {
      return List(log)
    })

    expect(writer.written().toArray()).toEqual(['something'])
  })

  it('bimaps over a writer', () => {
    const writer = Writer(List('a', 'b'), 27).bimap(
      log => log.map(l => l.toUpperCase()).toArray(),
      res => res * 100,
    )

    expect(writer.written()).toEqual(['A', 'B'])
    expect(writer.value()).toBe(2700)
  })

  it('maps over both params', () => {
    const writer = Writer(List('a', 'b'), 27).mapBoth((log, res) => [
      log.map(l => l.toUpperCase()).toArray(),
      res * 100,
    ])

    expect(writer.written()).toEqual(['A', 'B'])
    expect(writer.value()).toBe(2700)
  })
})

describe('using a writer in async environment', () => {
  doSlowly(() => 1).then(n => doSlowly(() => n + 1))

  doSlowly(() => doSlowly(() => doSlowly(() => 1)))

  function doSlowly<T>(fn: () => T) {
    return new Promise<T>(res => {
      setTimeout(res, 0)
    }).then(fn)
  }

  async function factAsyc(n: number): Promise<Writer<List<string>, number>> {
    if (n === 0) {
      return Writer(List(), 1)
    } else {
      return await doSlowly(async () =>
        (await factAsyc(n - 1)).flatMap(v => {
          const ans = v * n
          return Writer(List(`fact ${n} ${ans}`), ans)
        }),
      )
    }
  }

  it('does async stuff', async () => {
    const r = await Promise.all([factAsyc(3), factAsyc(5), factAsyc(4)])
    // console.log(r)
    return r
  })
})
