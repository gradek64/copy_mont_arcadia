const pantry = jest.fn()

export const mockPantry = (
  { res = {}, cookieJar = [], key } = {
    res: {},
    cookieJar: [],
    key: undefined,
  }
) => {
  const prepRes = (r) => {
    if (r instanceof Promise) return r
    if (typeof r !== 'object' || !('body' in r)) r = { body: r }
    return Promise.resolve(r)
  }
  const saveSessionMock = jest.fn()
  if (Array.isArray(res)) {
    res.forEach((r) => {
      saveSessionMock.mockReturnValueOnce(prepRes(r))
    })
  } else {
    saveSessionMock.mockReturnValue(prepRes(res))
  }

  const requestMock = jest.fn((fn) => {
    fn(cookieJar)
    return { saveSession: saveSessionMock }
  })
  const retrieveSessionMock = jest.fn(() => ({ request: requestMock }))
  pantry.mockReturnValue({
    retrieveSession: retrieveSessionMock,
    request: requestMock,
  })

  global.process.env.USE_MOCK_API = false
  global.process.env.REDIS_HOST_FOR_SESSION_STORE = 'host'
  global.process.env.REDIS_PORT_FOR_SESSION_STORE = 'port'

  return {
    verify: (timesCalled = 1, shouldRetrieveSession = true) => {
      expect(retrieveSessionMock).toHaveBeenCalledTimes(timesCalled)
      if (key && shouldRetrieveSession)
        expect(retrieveSessionMock).toHaveBeenCalledWith(key)
    },
    retrieveSessionMock,
    requestMock,
    saveSessionMock,
  }
}

export default pantry
