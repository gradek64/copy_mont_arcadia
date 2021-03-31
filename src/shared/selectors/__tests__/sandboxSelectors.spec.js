import deepFreeze from 'deep-freeze'

import * as SandboxSelectors from '../sandboxSelectors'

describe('sandbox selectors', () => {
  const state = deepFreeze({
    sandbox: {
      pages: [],
    },
  })

  describe('selectSandbox', () => {
    it('returns an empty object when sandbox state is not available', () => {
      expect(SandboxSelectors.selectSandbox({ bad: 'state' })).toEqual({})
    })

    it('returns sandbox state', () => {
      expect(SandboxSelectors.selectSandbox(state)).toBe(state.sandbox)
    })
  })

  describe('getSandboxStylesheets', () => {
    it('should return an empty array when no sandbox pages are available', () => {
      expect(SandboxSelectors.getSandboxStylesheets(state)).toEqual([])
    })

    it('should return an empty array when page has no css', () => {
      const stateWithPagesWithoutStyles = {
        sandbox: {
          pages: {
            home: [
              {
                head: {
                  link: [],
                },
              },
              {
                head: {
                  link: [
                    {
                      rel: 'canonical',
                      href: 'canonical-link',
                    },
                  ],
                },
              },
            ],
          },
        },
      }
      expect(
        SandboxSelectors.getSandboxStylesheets(stateWithPagesWithoutStyles)
      ).toEqual([])
    })

    it('should return an array of css objects, without url duplicates', () => {
      const stateWithPagesWithStyles = {
        sandbox: {
          pages: {
            home: {
              head: {
                link: [
                  {
                    rel: 'stylesheet',
                    href: 'css-link-unique',
                  },
                  {
                    rel: 'stylesheet',
                    href: 'css-link-not-unique',
                  },
                ],
              },
            },
            plp: {
              head: {
                link: [
                  {
                    rel: 'stylesheet',
                    href: 'css-link-not-unique',
                  },
                  {
                    rel: 'stylesheet',
                    href: 'css-link-unique-2',
                  },
                ],
              },
            },
          },
        },
      }

      expect(
        SandboxSelectors.getSandboxStylesheets(stateWithPagesWithStyles)
      ).toEqual([
        {
          rel: 'stylesheet',
          href: 'css-link-unique',
        },
        {
          rel: 'stylesheet',
          href: 'css-link-not-unique',
        },
        {
          rel: 'stylesheet',
          href: 'css-link-unique-2',
        },
      ])
    })
  })
})
