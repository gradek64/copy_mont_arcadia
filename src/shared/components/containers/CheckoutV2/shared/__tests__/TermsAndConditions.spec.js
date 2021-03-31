import testComponentHelper from 'test/unit/helpers/test-component'
import TermsAndConditions from '../TermsAndConditions'
import enDict from '../../../../../../shared/constants/dictionaries/default/en-GB.json'
import deDict from '../../../../../../shared/constants/dictionaries/default/de-DE.json'
import frDict from '../../../../../../shared/constants/dictionaries/default/fr-FR.json'
import { shallow } from 'enzyme'

describe('<TermsAndConditions />', () => {
  const renderComponent = testComponentHelper(TermsAndConditions)
  const defaultProps = {
    brandName: 'Topshop',
  }

  describe('@renders', () => {
    // TODO: how to render the links to display in snapshot
    it('should render default state', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('forDDPRenewal', () => {
    it("should show 'Terms & Conditions Link' when forDDPRenewal is true", () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        forDDPRenewal: true,
      })
      expect(wrapper.find('.TermsAndConditions').text()).toEqual(
        'Terms & Conditions link'
      )
    })
    it("should show 'By placing your order you agree to our Terms & Conditions and Privacy Policy.' when forDDPRenewal is false", () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        forDDPRenewal: false,
      })
      expect(wrapper.find('.TermsAndConditions').text()).toEqual(
        'By placing your order you agree to our Terms & Conditions and Privacy Policy. '
      )
    })
  })

  describe('passes correct brandName', () => {
    ;['Topshop', 'Burton', 'Wallis'].forEach((brandName) =>
      it(`renders passed brandName: ${brandName}`, () => {
        const { wrapper } = renderComponent({ brandName, isGuestOrder: true })
        expect(wrapper.find('.TermsAndConditions').text()).toEqual(
          `By placing your order you agree to our Terms & Conditions and Privacy Policy. You also consent to some of your data being stored by ${brandName}, which may be used to make future shopping experiences better for you.`
        )
      })
    )
  })

  describe('isGuestOrder', () => {
    it('should render text specific to the guest order summary when isGuestOrder is true', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        isGuestOrder: true,
      })
      expect(wrapper.find('.TermsAndConditions').text()).toEqual(
        `By placing your order you agree to our Terms & Conditions and Privacy Policy. You also consent to some of your data being stored by Topshop, which may be used to make future shopping experiences better for you.`
      )
    })
    it('should render generic t&c text when isGuestOrder is false', () => {
      const { wrapper } = renderComponent(defaultProps)
      expect(wrapper.find('.TermsAndConditions').text()).toEqual(
        `By placing your order you agree to our Terms & Conditions and Privacy Policy. `
      )
    })
  })

  describe('@methods', () => {
    describe('@constructContent', () => {
      const { instance } = renderComponent(defaultProps)
      it('should return an array with a length of 4', () => {
        // [S] tag indicates where to spit the string to an array
        const content =
          'By placing your order you agree to our [S][#]Terms & Conditions[S] and [S][#]Privacy Policy.'
        const newContent = instance.constructContent(content)
        expect(newContent).toHaveLength(4)
      })

      it('should return an array with two links', () => {
        // [#] tag indicates which content to transform to a link
        const content =
          'By placing your order you agree to our [S][#]Terms & Conditions[S] and [S][#]Privacy Policy.'
        const newContent = instance.constructContent(content)
        const renderLinkOne = shallow(newContent[1])
        const renderLinkTwo = shallow(newContent[3])
        expect(renderLinkOne.name()).toEqual('a')
        expect(renderLinkTwo.name()).toEqual('a')
      })

      it('should not create an empty link', () => {
        // [#] tag indicates which content to transform to a link
        const content =
          'Test [S][#]Terms & Conditions[S] and [S][#]Privacy Policy, [S] with some more [S][#]links'
        const newContent = instance.constructContent(content)
        // now the fift element should be a simple string
        expect(typeof newContent[5]).toEqual('string')
      })

      it('should use a string with the same number of links in link array', () => {
        const dictKey =
          'By placing your order you agree to our Terms & Conditions and Privacy Policy.'

        const langDict = [enDict[dictKey], deDict[dictKey], frDict[dictKey]]
        // Check the formatting of the Term and Condition string in every dictionary
        // english example:
        //    langmsg = 'By placing your order you agree to our [S][#]Terms & Conditions[S] and [S][#]Privacy Policy.'
        langDict.map((langmsg) => {
          // The string should contain a link ([#]) substitution charachter
          expect(langmsg).toContain('[#]')
          // number of links substitution in the string
          const strCount = langmsg.split('[#]').length - 1
          const newContent = instance.constructContent(langmsg)
          // number of links actually substituded from the constructContent fucntion
          const linkCount = newContent.reduce((acc, item) => {
            if (typeof item !== 'string' && shallow(item).name() === 'a') {
              acc++
            }
            return acc
          }, 0)
          expect(linkCount).toEqual(strCount)
          return langmsg
        })
      })
    })
  })
})
