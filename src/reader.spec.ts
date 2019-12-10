import { Reader } from './reader'

interface Config {
  url: string
  port: number
  key: string
}

describe('Reader', () => {
  const config1 = {
    url: 'http://test1.com',
    port: 8080,
    key: 's3cr3t',
  }
  const config2 = {
    url: 'http://test2.com',
    port: 8081,
    key: 'not so secret',
  }

  const connect = (endpoint: string) =>
    Reader((config: Config) => `POST ${config.url}:${config.port}/${endpoint}`)

  it('injects config with run()', () => {
    expect(connect('user').run(config1)).toBe('POST http://test1.com:8080/user')
    expect(connect('session').run(config2)).toBe('POST http://test2.com:8081/session')
  })

  it('is mappable', () => {
    const reader = connect('session').map(s => `${s}?secure=true`)

    expect(reader.run(config1)).toBe('POST http://test1.com:8080/session?secure=true')
  })

  it('is flatMappable', () => {
    const reader = connect('something').flatMap(connectionString =>
      Reader(config => `${connectionString}?secretKey=${config.key}`),
    )

    expect(reader.run(config1)).toBe('POST http://test1.com:8080/something?secretKey=s3cr3t')
  })
})
