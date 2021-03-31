import { getBrandHostnames } from '../'

jest.mock('../brands/miss-selfridge', () => [
  {
    brandName: 'missselfridge',
    domains: {
      prod: [],
    },
  },
])

describe('getBrandHostnames', () => {
  it('Throws a relevant error if prod urls are missing', () => {
    expect(() =>
      getBrandHostnames(
        'missselfridge',
        'test.missselfridge.domain.nonexistent.com'
      )
    ).toThrowError('Unable to get brand hostnames')
  })
})
