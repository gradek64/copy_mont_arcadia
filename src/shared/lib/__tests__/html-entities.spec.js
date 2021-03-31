import {
  heDecode,
  heEncode,
  heShallowEncode,
  removeUrlProtocol,
  replaceUrl,
} from '../html-entities'

describe('html-entities', () => {
  describe('heDecode', () => {
    it('heDecode able to translate strings containing html tags', () => {
      const innerHtml = '&#x27; &#039; &lt; &amp;quot; &gt;'
      const expected = "' ' < \" >"
      expect(heDecode(innerHtml)).toBe(expected)
    })
  })

  describe('heEncode', () => {
    it('encodes all the naughty characters', () => {
      expect(heEncode('foo&bar"baz\'quux<quack>duck`dave')).toBe(
        'foo&amp;bar&quot;baz&#x27;quux&lt;quack&gt;duck&#x60;dave'
      )
    })
  })

  describe('heShallowEncode', () => {
    it('encodes only < and >', () => {
      expect(heShallowEncode('foo&bar"baz\'quux<quack>duck`dave')).toBe(
        'foo&bar"baz\'quux&lt;quack&gt;duck`dave'
      )
    })
  })

  describe('replaceUrl', () => {
    it('should return and empty string if undefined', () => {
      const url = undefined
      const expected = ''
      expect(replaceUrl(url)).toBe(expected)
    })

    it('should return a part url string if protocol not included', () => {
      const url = 'category/jeans/blue-jeans.html'
      const expected = 'category/jeans/blue-jeans.html'
      expect(replaceUrl(url)).toBe(expected)
    })

    it('should remove protocol and domain name from url', () => {
      const url = 'http://www.topman.com/category/jeans/blue-jeans.html'
      const expected = '/category/jeans/blue-jeans.html'
      expect(replaceUrl(url)).toBe(expected)
    })
  })

  describe('removeUrlProtocol', () => {
    it('should remove http: from url', () => {
      const url = 'http://www.topshop.com'
      const expected = '//www.topshop.com'
      expect(removeUrlProtocol(url)).toBe(expected)
    })

    it('should remove https: from url', () => {
      const url = 'https://www.topshop.com'
      const expected = '//www.topshop.com'
      expect(removeUrlProtocol(url)).toBe(expected)
    })

    it('should return an empty string', () => {
      const url = undefined
      const expected = ''
      expect(removeUrlProtocol(url)).toBe(expected)
    })
  })
})
