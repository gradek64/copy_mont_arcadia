require('isomorphic-fetch')

function setMockRoute(route, config) {
  const baseURL = config.env.MOCK_SERVER_URL
  const port = config.env.MOCK_SERVER_PORT

  // eslint-disable-next-line
  return fetch(`http://${baseURL}:${port}/mocks`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(route),
  })
}

function cleanUpMocks(config) {
  const baseURL = config.env.MOCK_SERVER_URL
  const port = config.env.MOCK_SERVER_PORT

  // eslint-disable-next-line
  return fetch(`http://${baseURL}:${port}/mocks`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
}

module.exports = {
  setMockRoute,
  cleanUpMocks,
}
