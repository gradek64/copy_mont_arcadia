import {
  keyValueEncodeURI,
  keyValueDecodeURI,
  sanitiseRefinement,
  splitQuery,
  joinQuery,
  replaceDomain,
} from '../query-helper'

describe('query helper', () => {
  describe('keyValueEncodeURI', () => {
    it('should return in correct format', () => {
      const keyValuePairs = {
        colour: ['black', 'blue'],
        size: ['8', '10'],
        price: ['20', '120'],
        [`i'm a key`]: ['value 1', 'value 2'],
      }
      const result = `colour:black,colour:blue,size:8,size:10,price:20,price:120,i'm%20a%20key:value%201,i'm%20a%20key:value%202`
      expect(keyValueEncodeURI(keyValuePairs)).toEqual(result)
    })
    it('should handle duplicates', () => {
      const keyValuePairs = {
        colour: ['black', 'blue', 'blue'],
        size: ['8', '10'],
        price: ['20', '120'],
        [`i'm a key`]: ['value 1', 'value 2'],
      }
      const result = `colour:black,colour:blue,size:8,size:10,price:20,price:120,i'm%20a%20key:value%201,i'm%20a%20key:value%202`
      expect(keyValueEncodeURI(keyValuePairs)).toEqual(result)
    })
    it('should return undefined if typeof argument is not an object', () => {
      expect(keyValueEncodeURI(null)).toEqual(undefined)
    })
  })

  describe('keyValueDecodeURI', () => {
    it('should return in correct format', () => {
      const keyValueString = `colour:black,colour:blue,size:8,size:10,price:20,price:120,i'm%20a%20key:value%201,i'm%20a%20key:value%202`
      const result = {
        colour: ['black', 'blue'],
        size: ['8', '10'],
        price: ['20', '120'],
        [`i'm a key`]: ['value 1', 'value 2'],
      }
      expect(keyValueDecodeURI(keyValueString)).toEqual(result)
    })
    it('should return {} if typeof argument is not an object', () => {
      expect(keyValueDecodeURI(null)).toEqual({})
    })
    it('should NOT include price if length of price array is less than 2', () => {
      const keyValueString = `colour:black,colour:blue,size:8,size:10,price:20,i'm%20a%20key:value%201,i'm%20a%20key:value%202` // contains only one price key/value pair
      const result = {
        colour: ['black', 'blue'],
        size: ['8', '10'],
        [`i'm a key`]: ['value 1', 'value 2'],
      }
      expect(keyValueDecodeURI(keyValueString)).toEqual(result)
    })
  })

  describe('sanitiseRefinement', () => {
    it('should only return nummbers or strings', () => {
      const keyValuePairs = [
        9,
        'XL',
        11,
        null,
        undefined,
        {},
        [],
        [1, '2', undefined],
      ]
      const result = [9, 'XL', 11]
      expect(sanitiseRefinement(keyValuePairs)).toEqual(result)
    })
    it('should return false if NOT array', () => {
      const keyValuePairs = 9
      const result = false
      expect(sanitiseRefinement(keyValuePairs)).toEqual(result)
    })
  })

  describe('splitQuery', () => {
    it('should split query into an object where the property is the query name and the value is the critiria', () => {
      const { cat, dog } = splitQuery('?cat=dav&dog=jim')
      expect(cat).toEqual('dav')
      expect(dog).toEqual('jim')
    })
    it('should decode values', () => {
      const { cat } = splitQuery('?cat=203984%2C277012')
      expect(cat).toEqual('203984,277012')
    })
    it('should return an empty object if an empty string is passed in', () => {
      const obj = splitQuery('')
      expect(obj).toEqual({})
    })
  })

  describe('joinQuery', () => {
    it('should join a complex object into a url', () => {
      const obj = {
        one: 'a string',
        two: ['something', 'something else'],
        three: 87,
      }
      const url = joinQuery(obj)
      expect(url).toEqual(
        '?one=a%20string&two=something%2Csomething%20else&three=87'
      )
    })
    it('should remove any invalid parameters', () => {
      const obj = {
        '': 'undefined',
        ' ': 'undefined',
        one: 'a string',
        two: 87,
      }
      const url = joinQuery(obj)
      expect(url).toEqual('?one=a%20string&two=87')
    })

    it('should return an empty string if no params are required', () => {
      const obj = {}
      const url = joinQuery(obj)
      expect(url).toEqual('')
    })
  })

  describe('replaceDomain', () => {
    it('should join a complex object into a url', () => {
      expect(
        replaceDomain('http://test.topshop.com/hello', 'NEW_DOMAIN')
      ).toEqual('http://NEW_DOMAIN/hello')
      expect(
        replaceDomain('http://test.topshop.com/hello/twice', 'NEW_DOMAIN')
      ).toEqual('http://NEW_DOMAIN/hello/twice')
      expect(
        replaceDomain('//test.topshop.com/hello/twice', 'NEW_DOMAIN')
      ).toEqual('//NEW_DOMAIN/hello/twice')
      expect(
        replaceDomain('test.topshop.com/hello/twice', 'NEW_DOMAIN')
      ).toEqual('NEW_DOMAIN/hello/twice')
    })
  })
})
