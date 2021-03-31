import testComponentHelper from 'test/unit/helpers/test-component'

import SocialProofProductMetaLabel from '../SocialProofProductMetaLabel'

const props = {
  isFeatureSocialProofMetaLabelEnabled: true,
  isTrending: true,
}

const render = testComponentHelper(SocialProofProductMetaLabel.WrappedComponent)

describe('<SocialProofProductMetaLabel />', () => {
  it('should render the label "Trending Product" with an image when provided the correct props', () => {
    const { wrapper } = render(props)
    expect(wrapper.text()).toBe('Trending Product')
    expect(wrapper.find('img')).toHaveLength(1)
  })

  it('should render `null` if the social proof feature flag is disabled', () => {
    const { wrapper } = render({
      ...props,
      isFeatureSocialProofMetaLabelEnabled: false,
    })
    expect(wrapper.html()).toBe(null)
  })

  it('should render `null` if the product is not trending', () => {
    const { wrapper } = render({
      ...props,
      isTrending: false,
    })
    expect(wrapper.html()).toBe(null)
  })
})
