import { findExactAddressByMoniker, findAddress } from '../findAddressActions'
import { getMockStoreWithInitialReduxState } from '../../../../../test/unit/helpers/get-redux-mock-store'

// mocks
import { get } from '../../../lib/api-service'

jest.mock('../../../lib/api-service', () => ({
  get: jest.fn(),
}))

const initialState = {
  config: {
    langHostnames: {
      default: {
        defaultLanguage: 'English',
      },
    },
    brandName: 'topshop',
  },
}

describe('findAddress Actions', () => {
  const store = getMockStoreWithInitialReduxState(initialState)
  const exactMonikerResponse = {
    address1: '2 Britten Close',
    address2: null,
    city: 'LONDON',
    country: 'United Kingdom',
    postcode: 'NW11 7HQ',
    state: null,
  }
  const multipleMonikersResponse = [
    {
      address: '1 Britten Close, LONDON NW11 7HQ',
      moniker:
        'GBR|9c617812-f075-41bc-9cd7-0da30d7e3618|7.610sOGBRFArhBwAAAAABAwEAAAABfqEAkgAgAAAAAAAAMQAA..9kAAAAAP....8AAAAAAAAAAAAAAAAAAAAsTlcxMSA3SFEA',
    },
    {
      address: '2 Britten Close, LONDON NW11 7HQ',
      moniker:
        'GBR|9c617812-f075-41bc-9cd7-0da30d7e3618|7.610IOGBRFArhBwAAAAABAwEAAAABfqEAkgAgAAAAAAAAMgAA..9kAAAAAP....8AAAAAAAAAAAAAAAAAAAAsTlcxMSA3SFEA',
    },
    {
      address: '3 Britten Close, LONDON NW11 7HQ',
      moniker:
        'GBR|9c617812-f075-41bc-9cd7-0da30d7e3618|7.610zOGBRFArhBwAAAAABAwEAAAABfqEAkgAgAAAAAAAAMwAA..9kAAAAAP....8AAAAAAAAAAAAAAAAAAAAsTlcxMSA3SFEA',
    },
  ]

  beforeEach(() => {
    get.mockImplementation((url) => () => {
      switch (true) {
        case /\/address\/[-|.\w]*\?country=\w*/.test(url):
          return Promise.resolve({
            body: exactMonikerResponse,
          })
        case /\/address\?[=\w]*/.test(url):
          return Promise.resolve({
            body: multipleMonikersResponse,
          })
        default:
          return Promise.reject({})
      }
    })
    jest.clearAllMocks()
    // important to clearActions to avoid concatenation
    store.clearActions()
  })

  describe('findExactAddressByMoniker', () => {
    const params = {
      moniker: '',
      country: '',
      formNames: { address: '', findAddress: '', details: '' },
    }

    it('should call ajaxCounter with increment and decrement', () => {
      return store.dispatch(findExactAddressByMoniker(params)).then(() => {
        expect(store.getActions()[0]).toEqual({
          type: 'AJAXCOUNTER_INCREMENT',
        })
        expect(store.getActions()[1]).toEqual({
          type: 'AJAXCOUNTER_DECREMENT',
        })
      })
    })

    it('should return address as a result', () => {
      return store.dispatch(findExactAddressByMoniker(params)).then((res) => {
        expect(res).toEqual({ body: exactMonikerResponse })
      })
    })

    it('encodes the moniker param', () => {
      store.dispatch(
        findExactAddressByMoniker({
          ...params,
          moniker: 'test/test',
          country: 'GB',
        })
      )

      expect(get).toHaveBeenCalledWith('/address/test%2Ftest?country=GB')
    })

    describe('On Failure', () => {
      it('should decrement and set error when failure', () => {
        get.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {
              body: {
                message: 'error',
              },
            },
          })
        )

        return store.dispatch(findExactAddressByMoniker(params)).then(() => {
          expect(store.getActions()[0]).toEqual({
            type: 'AJAXCOUNTER_INCREMENT',
          })
          expect(store.getActions()[1]).toEqual({
            type: 'AJAXCOUNTER_DECREMENT',
          })
          expect(store.getActions()[2]).toEqual({
            type: 'SET_FORM_MESSAGE',
            formName: '',
            message: { type: 'error', message: 'error' },
            key: null,
          })
        })
      })

      it('should show default error when unexpected failure', () => {
        get.mockImplementationOnce(() => () => Promise.reject({}))
        return store.dispatch(findExactAddressByMoniker(params)).then(() => {
          expect(store.getActions()[2]).toEqual({
            type: 'SET_FORM_MESSAGE',
            formName: '',
            message: {
              type: 'error',
              message:
                'We are unable to find your address at the moment. Please enter your address manually.',
            },
            key: null,
          })
        })
      })
    })
  })

  describe('findAddress', () => {
    const params = {
      data: {
        address: '',
        country: 'GBR',
        postcode: 'NW11 7HQ',
      },
      formNames: { address: '', findAddress: '', details: '' },
    }

    describe('Multiple Addresses returned', () => {
      it('should call ajaxCounter with increment and decrement', () => {
        return store.dispatch(findAddress(params)).then(() => {
          expect(store.getActions()[0]).toEqual({
            type: 'AJAXCOUNTER_INCREMENT',
          })
          expect(store.getActions()[2]).toEqual({
            type: 'AJAXCOUNTER_DECREMENT',
          })
        })
      })

      it('should clear form message', () => {
        return store.dispatch(findAddress(params)).then(() => {
          expect(store.getActions()[1]).toEqual({
            type: 'SET_FORM_MESSAGE',
            formName: '',
            message: { type: 'error', message: '' },
            key: null,
          })
        })
      })

      it('should return addresses (monikers) as a result', () => {
        return store.dispatch(findAddress(params)).then((res) => {
          expect(res).toEqual(multipleMonikersResponse)
        })
      })

      it('should show default error when response is empty', async () => {
        get.mockImplementationOnce(() => () => Promise.resolve([]))
        await store.dispatch(findAddress(params))
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            {
              type: 'SET_FORM_MESSAGE',
              formName: '',
              message: {
                type: 'error',
                message:
                  'We are unable to find your address at the moment. Please enter your address manually.',
              },
              key: null,
            },
          ])
        )
      })

      describe('On Failure', () => {
        it('should decrement and set error when failure', () => {
          get.mockImplementationOnce(() => () =>
            Promise.reject({
              response: {
                body: {
                  message: 'error',
                },
              },
            })
          )
          return store.dispatch(findAddress(params)).then(() => {
            expect(store.getActions()[0]).toEqual({
              type: 'AJAXCOUNTER_INCREMENT',
            })
            expect(store.getActions()[2]).toEqual({
              type: 'AJAXCOUNTER_DECREMENT',
            })
            expect(store.getActions()[3]).toEqual({
              type: 'SET_FORM_MESSAGE',
              formName: '',
              message: { type: 'error', message: 'error' },
              key: null,
            })
          })
        })
        it('should show default error when unexpected failure', () => {
          get.mockImplementationOnce(() => () => Promise.reject({}))
          return store.dispatch(findAddress(params)).then(() => {
            expect(store.getActions()).toEqual(
              expect.arrayContaining([
                {
                  type: 'SET_FORM_MESSAGE',
                  formName: '',
                  message: {
                    type: 'error',
                    message:
                      'We are unable to find your address at the moment. Please enter your address manually.',
                  },
                  key: null,
                },
              ])
            )
          })
        })
        it('should show default error when no res in body', () => {
          get.mockImplementationOnce(() => () => Promise.resolve({}))
          return store.dispatch(findAddress(params)).then(() => {
            expect(store.getActions()).toEqual(
              expect.arrayContaining([
                {
                  type: 'SET_FORM_MESSAGE',
                  formName: '',
                  message: {
                    type: 'error',
                    message:
                      'We are unable to find your address at the moment. Please enter your address manually.',
                  },
                  key: null,
                },
              ])
            )
          })
        })
      })
    })
    describe('One Address returned', () => {
      it('should call RESET_FORM with the moniker', () => {
        const onlyOneMonikerResponse = [
          {
            address: '3 Britten Close, LONDON NW11 7HQ',
            moniker:
              'GBR|9c617812-f075-41bc-9cd7-0da30d7e3618|7.610zOGBRFArhBwAAAAABAwEAAAABfqEAkgAgAAAAAAAAMwAA..9kAAAAAP....8AAAAAAAAAAAAAAAAAAAAsTlcxMSA3SFEA',
          },
        ]
        get.mockImplementation((url) => () => {
          switch (true) {
            case /\/address\/[%-|.\w]*\?country=\w*/.test(url):
              return Promise.resolve({
                body: exactMonikerResponse,
              })
            case /\/address\?[%=\w]*/.test(url):
              return Promise.resolve({
                body: onlyOneMonikerResponse,
              })
            default:
              return Promise.reject({})
          }
        })
        return store.dispatch(findAddress(params)).then(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining([
              {
                type: 'RESET_FORM',
                formName: '',
                initialValues: { ...exactMonikerResponse, isManual: true },
                key: null,
              },
            ])
          )
        })
      })
    })
  })
})
