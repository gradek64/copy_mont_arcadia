import footerReducer from '../footerReducer'
import { setFooterConfig } from '../../../actions/common/footerActions'

describe('footerReducer', () => {
  describe('setFooterConfig()', () => {
    it('should set `config`', () => {
      const config = {
        testData: 'testData',
      }

      expect(footerReducer({ config }, setFooterConfig(config))).toEqual({
        config,
      })
    })
  })

  describe('SET_FOOTER_NEWSLETTER()', () => {
    it('should set `footerCategories`', () => {
      const newsletter = {
        label: 'Sign up and get 20% off',
        placeholder: 'Enter your email address',
        button: 'Sign Up',
        signUpUrl:
          '/en/tsuk/category/help-information-5634539/sign-up-to-style-notes-5651318',
        openNewWindow: false,
      }

      const action = {
        type: 'SET_FOOTER_NEWSLETTER',
        newsletter,
      }

      expect(footerReducer({ newsletter }, action)).toEqual({
        newsletter,
      })
    })
  })
})

describe('UPDATE_FOOTER_SCROLL_OFFSET', () => {
  it('should set `footer.scrollOffset`', () => {
    const scrollOffset = 100
    expect(
      footerReducer(
        { scrollOffset },
        {
          type: 'UPDATE_FOOTER_SCROLL_OFFSET',
          scrollOffset,
        }
      )
    ).toEqual({
      scrollOffset,
    })
  })
})
