import {
  buildComponentRender,
  shallowRender,
} from '../../../../../../test/unit/helpers/test-component'

import Content from '../Content'

describe('<Subcategory />', () => {
  const initProps = {
    arraySubcategories: [
      {
        url: 'http://www.topman.com',
        label: 'This is a label',
        paddingTop: 20,
        image: {
          span: 1,
          url: 'http://topman.com',
        },
      },
      {
        url: 'http://www.topman.com',
        label: 'This is a label',
        paddingTop: 20,
        image: {
          span: 1,
          url: 'http://topman.com',
        },
      },
    ],
    blockName: 'Jeans',
  }

  const renderComponent = buildComponentRender(shallowRender, Content)

  describe('@renders', () => {
    it('should render default state', () => {
      expect(renderComponent(initProps).getTree()).toMatchSnapshot()
    })

    it('should render without a subcategory header', () => {
      expect(
        renderComponent({ ...initProps, blockName: '' }).getTree()
      ).toMatchSnapshot()
    })
  })
})
