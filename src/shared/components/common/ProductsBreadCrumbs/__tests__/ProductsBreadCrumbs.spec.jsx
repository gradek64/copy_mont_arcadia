import testComponentHelper from 'test/unit/helpers/test-component'
import ProductsBreadCrumbs from '../ProductsBreadCrumbs'
import FeatureCheck from '../../../common/FeatureCheck/FeatureCheck'
import { Link } from 'react-router'

describe('<ProductsBreadCrumbs/>', () => {
  const breadcrumbsWithOnlyLabels = [{ label: 'Home' }, { label: 'label 2' }]
  const breadcrumbsWithLabelsAndUrl = [
    { label: 'label 1', url: 'url 1' },
    { label: 'label 2' },
  ]

  const renderComponent = testComponentHelper(ProductsBreadCrumbs)

  it('should render null when not passed items', () => {
    const { wrapper } = renderComponent()
    expect(wrapper.get(0)).toBeNull()
  })

  it('should render FeatureCheck', () => {
    const { wrapper } = renderComponent({
      breadcrumbs: breadcrumbsWithOnlyLabels,
    })
    expect(wrapper.find(FeatureCheck)).toHaveLength(1)
  })

  it('should render list of labels with no links', () => {
    const { wrapper } = renderComponent({
      breadcrumbs: breadcrumbsWithOnlyLabels,
    })
    expect(wrapper.find('li')).toHaveLength(2)
    expect(wrapper.find(Link)).toHaveLength(0)
  })

  it('should render list of labels with links', () => {
    const { wrapper } = renderComponent({
      breadcrumbs: breadcrumbsWithLabelsAndUrl,
    })
    expect(wrapper.find('li')).toHaveLength(2)
    expect(wrapper.find(Link)).toHaveLength(1)
  })

  it('should render with microdata', () => {
    const { wrapper } = renderComponent({
      breadcrumbs: breadcrumbsWithLabelsAndUrl,
    })

    expect(wrapper.find('ol').props()).toMatchObject({
      itemType: 'http://schema.org/BreadcrumbList',
      itemScope: true,
    })
    expect(
      wrapper
        .find('li')
        .first()
        .props()
    ).toMatchObject({
      itemType: 'http://schema.org/ListItem',
      itemProp: 'itemListElement',
      itemScope: true,
    })
  })
})
