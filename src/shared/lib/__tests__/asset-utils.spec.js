import * as utils from '../asset-utils'

describe('asset-utils', () => {
  const deferredLoadMediaValue = 'defer-load'
  const mediaDataAttributeName = 'data-breakpoint'
  const media = '(min-width: 1200px)'

  describe('deferStyles', () => {
    it('should return undefined if styles are not defined', () => {
      expect(utils.deferStyles()).toBe(undefined)
    })

    it('should return empty array when empty array is passed in', () => {
      const styles = []
      expect(utils.deferStyles(styles)).toBe(styles)
    })

    it('should not modify links that are not stylesheets', () => {
      const input = [
        {
          rel: 'canonical',
          href: 'canonical-url',
        },
        {
          rel: 'next',
          href: 'next-page-url',
        },
      ]
      expect(utils.deferStyles(input)).toEqual(input)
    })

    it('should modify stylesheets', () => {
      const input = [
        {
          rel: 'stylesheet',
          href: 'stylesheet-url-without-media',
        },
        {
          rel: 'stylesheet',
          href: 'stylesheet-url-with-media',
          media,
        },
      ]
      const output = [
        {
          rel: 'stylesheet',
          href: 'stylesheet-url-without-media',
          media: deferredLoadMediaValue,
          [mediaDataAttributeName]: 'all',
        },
        {
          rel: 'stylesheet',
          href: 'stylesheet-url-with-media',
          media: deferredLoadMediaValue,
          [mediaDataAttributeName]: media,
        },
      ]
      expect(utils.deferStyles(input)).toEqual(output)
    })
  })

  describe('activateDeferredStylesCallback', () => {
    it('should return the same array if assets are not deferred', () => {
      const state = {}
      expect(utils.activateDeferredStylesCallback(state)).toEqual(state)
    })

    it('should return the same array if assets are not deferred', () => {
      const state = {
        linkTags: [
          {
            rel: 'stylesheet',
            href: 'stylesheet-url-without-media',
          },
          {
            rel: 'stylesheet',
            href: 'stylesheet-url-with-media',
            media,
          },
        ],
      }

      expect(utils.activateDeferredStylesCallback(state)).toEqual(state)
    })

    it('should return an array of activated styles', () => {
      const link1 = {
        rel: 'stylesheet',
        href: 'stylesheet-url-1',
        media: deferredLoadMediaValue,
        [mediaDataAttributeName]: 'all',
      }
      const link2 = {
        rel: 'stylesheet',
        href: 'stylesheet-url-2',
        media: deferredLoadMediaValue,
        [mediaDataAttributeName]: media,
      }

      const state = {
        linkTags: [link1, link2],
      }
      const newState = {
        linkTags: [
          {
            ...link1,
            media: link1[mediaDataAttributeName],
          },
          {
            ...link2,
            media: link2[mediaDataAttributeName],
          },
        ],
      }

      expect(utils.activateDeferredStylesCallback(state)).toEqual(newState)
    })
  })

  describe('activateDeferredStyles', () => {
    it('should return the same array if assets are not deferred', () => {
      expect(utils.activateDeferredStyles()).toEqual([])
    })

    it('should return the same array if assets are not deferred', () => {
      const links = [
        {
          rel: 'stylesheet',
          href: 'stylesheet-url-without-media-1',
          [mediaDataAttributeName]: media,
          media: deferredLoadMediaValue,
        },
        {
          rel: 'stylesheet',
          href: 'stylesheet-url-with-media-2',
          [mediaDataAttributeName]: media,
          media: deferredLoadMediaValue,
        },
      ]

      expect(utils.activateDeferredStyles(links)).toEqual([
        {
          rel: 'stylesheet',
          href: 'stylesheet-url-without-media-1',
          [mediaDataAttributeName]: media,
          media,
        },
        {
          rel: 'stylesheet',
          href: 'stylesheet-url-with-media-2',
          [mediaDataAttributeName]: media,
          media,
        },
      ])
    })
  })
})
