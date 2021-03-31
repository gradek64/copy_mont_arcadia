import { basicAuthVerification } from '../auth'

describe('basicAuthVerification', () => {
  let originalUserName
  let originalPW
  const fakeUserName = 'monty'
  const fakePW = 'monty'
  const fakeRequest = {}
  const creds = {
    id: '1337',
    name: 'Sir Montague',
  }
  beforeAll(() => {
    originalUserName = process.env.BASIC_AUTH_USERNAME
    originalPW = process.env.BASIC_AUTH_PASSWORD
    process.env.BASIC_AUTH_USERNAME = fakeUserName
    process.env.BASIC_AUTH_PASSWORD = fakePW
  })
  afterAll(() => {
    process.env.BASIC_AUTH_USERNAME = originalUserName
    process.env.BASIC_AUTH_PASSWORD = originalPW
  })

  it('should verify user if they provide a username and pw matching the environment variables', () => {
    const mockCB = jest.fn()
    expect(mockCB).not.toHaveBeenCalled()
    basicAuthVerification(fakeRequest, fakeUserName, fakePW, mockCB)
    expect(mockCB).toHaveBeenCalledWith(null, true, creds)
  })

  it('should reject user if they provide incorrect username', () => {
    const mockCB = jest.fn()
    expect(mockCB).not.toHaveBeenCalled()
    basicAuthVerification(fakeRequest, 'someone else', fakePW, mockCB)
    expect(mockCB).toHaveBeenCalledWith(null, false, creds)
  })

  it('should reject user if they provide incorrect pw', () => {
    const mockCB = jest.fn()
    expect(mockCB).not.toHaveBeenCalled()
    basicAuthVerification(fakeRequest, fakeUserName, '????', mockCB)
    expect(mockCB).toHaveBeenCalledWith(null, false, creds)
  })

  it('should reject user if they provide incorrect username & pw', () => {
    const mockCB = jest.fn()
    expect(mockCB).not.toHaveBeenCalled()
    basicAuthVerification(fakeRequest, 'someone else', '????', mockCB)
    expect(mockCB).toHaveBeenCalledWith(null, false, creds)
  })
})
