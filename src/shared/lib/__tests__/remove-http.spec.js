import removeHttp from '../remove-http'

describe('Remove HTTP', () => {
  it('remove http should return a url without a specific protocal 1', () => {
    expect(removeHttp('http://test.com')).toEqual('//test.com')
  })

  it('remove http should return an empyt string if it is given an empty string', () => {
    expect(removeHttp('')).toEqual('')
  })

  it('remove http should return a url without a specific protocal 2', () => {
    expect(removeHttp('//test.com')).toEqual('//test.com')
  })

  it('should handle port', () => {
    expect(removeHttp('https://test.com:3010')).toEqual('//test.com:3010')
  })

  it('should handle https and port', () => {
    expect(removeHttp('https://test.com:3010')).toEqual('//test.com:3010')
  })

  it('should handle localhost', () => {
    expect(removeHttp('http://localhost.com:3010')).toEqual(
      'http://localhost.com:3010'
    )
  })
})
