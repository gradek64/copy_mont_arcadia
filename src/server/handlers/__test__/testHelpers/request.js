import url from 'url'

export const createUnauthedReq = (route = '/') => ({
  headers: {},
  info: {
    hostname: 'local.m.topshop.com',
  },
  state: {},
  url: url.parse(route),
})

export const createAuthenticatedReq = (route = '/') => ({
  headers: {
    cookie: 'authenticated=yes; ',
  },
  info: {
    hostname: 'local.m.topshop.com',
  },
  state: {
    authenticated: 'yes',
  },
  url: url.parse(route),
})
