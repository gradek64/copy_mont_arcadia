import { gen } from 'testcheck'

import hostnameReducer from '../hostnameReducer'

/*
 * What lies ahead is some generative testing. See full-monty/docs/testcheck.md for info
 * Don't be afraid, give it a good read first.
 * 
 * check.it() comes from 'jasmine-check' package, a Jasmine wrapper around 'testcheck-js' package.
 */

describe('#hostnameReducer', () => {
  const generateValues = () =>
    gen.boolean.then((x) =>
      gen.boolean.then((y) =>
        gen.boolean.then((z) => ({
          isMobile: x,
          isMobileMainDev: y,
          isDesktopMainDev: z,
        }))
      )
    )
  const generateInput = () =>
    generateValues().then((initialState) =>
      generateValues().then((actionValues) => ({
        initialState,
        actionValues,
      }))
    )

  const input = generateInput()
  check.it(
    'sets hostname properties as expected',
    input,
    ({ initialState, actionValues }) =>
      expect(
        hostnameReducer(initialState, {
          type: 'SET_HOSTNAME_PROPERTIES',
          ...actionValues,
        })
      ).toEqual(actionValues)
  )
})
