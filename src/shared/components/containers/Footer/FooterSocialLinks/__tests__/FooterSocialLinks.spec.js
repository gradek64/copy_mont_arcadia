import testComponentHelper from 'test/unit/helpers/test-component'
import FooterSocialLinks from '../FooterSocialLinks'

const props = {
  brandName: 'topman',
  socialLinks: {
    isVisible: true,
    location: 'top-left',
    links: [
      {
        fileName: 'facebook00.svg',
        linkUrl: 'http://www.facebook.com/topman',
      },
      {
        fileName: 'twitter00.svg',
        linkUrl: 'http://www.twitter.com/topman',
      },
      {
        fileName: 'instagram000.svg',
        linkUrl: 'https://www.instagram.com/topman/',
      },
      {
        fileName: 'snapchat00.svg',
        linkUrl: 'https://www.snapchat.com/add/topman_snaps',
      },
      {
        fileName: 'pintrest00.svg',
        linkUrl: 'http://pinterest.com/topman/',
      },
      {
        fileName: 'tumbler00.svg',
        linkUrl: 'http://topman.tumblr.com/',
      },
    ],
  },
}

describe('<FooterSocialLinks />', () => {
  const renderComponent = testComponentHelper(FooterSocialLinks)

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })
  })
})
