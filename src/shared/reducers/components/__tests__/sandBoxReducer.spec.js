import sandboxReducer from '../sandBoxReducer'

describe('sandboxReducer', () => {
  describe('#SET_SANDBOX_CONTENT', () => {
    it('sets page content', () => {
      expect(
        sandboxReducer(
          { pages: {} },
          {
            type: 'SET_SANDBOX_CONTENT',
            key: 'pageName',
            content: 'pageContent',
          }
        )
      ).toEqual({ pages: { pageName: 'pageContent' } })
    })
  })
  describe('#RESET_SANDBOX_CONTENT', () => {
    it('resets pages', () => {
      expect(
        sandboxReducer(
          { pages: { pageName: 'pageContent' } },
          { type: 'RESET_SANDBOX_CONTENT' }
        )
      ).toEqual({ pages: {} })
    })
  })
  describe('#REMOVE_SANDBOX_CONTENT', () => {
    it('removes a page', () => {
      expect(
        sandboxReducer(
          {
            pages: {
              pageName: 'pageContent',
              pageToRemove: 'pageContentToRemove',
            },
          },
          { type: 'REMOVE_SANDBOX_CONTENT', key: 'pageToRemove' }
        )
      ).toEqual({ pages: { pageName: 'pageContent' } })
    })
  })
  describe('#SHOW_TACTICAL_MESSAGE', () => {
    it('creates and sets showTacticalMessage to true if not present', () => {
      expect(
        sandboxReducer(
          { pages: { pageName: 'pageContent' } },
          { type: 'SHOW_TACTICAL_MESSAGE' }
        )
      ).toEqual({
        pages: { pageName: 'pageContent' },
        showTacticalMessage: true,
      })
    })
    it('sets showTacticalMessage to true if already true', () => {
      expect(
        sandboxReducer(
          { pages: { pageName: 'pageContent' }, showTacticalMessage: true },
          { type: 'SHOW_TACTICAL_MESSAGE' }
        )
      ).toEqual({
        pages: { pageName: 'pageContent' },
        showTacticalMessage: true,
      })
    })
    it('sets showTacticalMessage to true if already false', () => {
      expect(
        sandboxReducer(
          { pages: { pageName: 'pageContent' }, showTacticalMessage: false },
          { type: 'SHOW_TACTICAL_MESSAGE' }
        )
      ).toEqual({
        pages: { pageName: 'pageContent' },
        showTacticalMessage: true,
      })
    })
  })
  describe('#HIDE_TACTICAL_MESSAGE', () => {
    it('creates and sets showTacticalMessage to false if not present', () => {
      expect(
        sandboxReducer(
          { pages: { pageName: 'pageContent' } },
          { type: 'HIDE_TACTICAL_MESSAGE' }
        )
      ).toEqual({
        pages: { pageName: 'pageContent' },
        showTacticalMessage: false,
      })
    })
    it('sets showTacticalMessage to false if already true', () => {
      expect(
        sandboxReducer(
          { pages: { pageName: 'pageContent' }, showTacticalMessage: true },
          { type: 'HIDE_TACTICAL_MESSAGE' }
        )
      ).toEqual({
        pages: { pageName: 'pageContent' },
        showTacticalMessage: false,
      })
    })
    it('sets showTacticalMessage to true if alreadyfalse', () => {
      expect(
        sandboxReducer(
          { pages: { pageName: 'pageContent' }, showTacticalMessage: false },
          { type: 'HIDE_TACTICAL_MESSAGE' }
        )
      ).toEqual({
        pages: { pageName: 'pageContent' },
        showTacticalMessage: false,
      })
    })
  })
})
