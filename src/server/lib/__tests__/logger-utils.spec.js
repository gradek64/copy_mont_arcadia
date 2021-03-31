import { printLog, maskObject } from '../logger-utils'

jest.mock('debug', () => {
  const namespaced = jest.fn()
  const d = jest.fn(() => namespaced)
  namespaced.color = {}
  return d
})
import debugLib from 'debug'

describe('logger-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('debug Lib', () => {
    it('printLog', () => {
      printLog('info', 'hello', { aaa: 'bbb' })
      expect(debugLib).toHaveBeenCalledTimes(1)
      expect(debugLib).toHaveBeenCalledWith('monty:hello')
      expect(debugLib().color).toEqual(2)
    })
  })

  describe('maskObject', () => {
    it('returns empty JSON object if param is not JSON or JS object', () => {
      const expected = {}

      expect(maskObject('')).toBe('')
      expect(maskObject('Hello')).toEqual({ message: 'Hello' })
      expect(maskObject(undefined)).toBe(undefined)
      expect(maskObject(true)).toEqual({ message: true })
      expect(maskObject([])).toEqual(expected)
    })

    it('returns a JSON object with no fields replaced if no sensitive fields are present in the object passed to the function', () => {
      const object = { objectKey: 'mockValue' }
      const expected = object

      expect(maskObject(object)).toEqual(expected)
    })

    it('replaces the value of any sensitive fields present in the object passed to the function with a masked value', () => {
      const object = {
        objectKey: 'mockValue',
        cardNumber: 'something sensitive',
      }
      const maskedCardNumber = maskObject(object).cardNumber

      expect(maskedCardNumber).not.toEqual(object.cardNumber)
    })

    it('checks nested objects within the given object for appearances of sensitive fields and masks them if they appear are found', () => {
      const object = {
        objectKey: 'mockValue',
        cardNumber: 'something sensitive',
        moreObject: {
          randomKey: 'value',
          cardNumber: 'sensitive things',
          deeperObject: {
            cardNumber: 'SENSITIVE',
          },
        },
      }
      const maskedObject = maskObject(object)
      const newCardNumber = maskedObject.cardNumber
      const deepCardNumber = maskedObject.moreObject.cardNumber
      const deeperCardNumber = maskedObject.moreObject.deeperObject.cardNumber

      expect(newCardNumber).not.toEqual(object.cardNumber)
      expect(deepCardNumber).toBeTruthy()
      expect(deepCardNumber).not.toEqual(object.moreObject.cardNumber)
      expect(deeperCardNumber).toBeTruthy()
      expect(deeperCardNumber).not.toEqual(
        object.moreObject.deeperObject.cardNumber
      )
    })

    it('masks logonPasswordOld', () => {
      const object = {
        logonPasswordOld: 'maskMe',
      }
      const maskedObject = maskObject(object)
      expect(maskedObject.logonPasswordOld).not.toEqual(object.logonPasswordOld)
    })
  })
})
