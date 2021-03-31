import {
  buildComponentRender,
  shallowRender,
} from '../../../../../../test/unit/helpers/test-component'

import Column from '../Column'
import Content from '../Content'

describe('<Column />', () => {
  const requiredProps = {
    category: {
      columns: [{ span: 1 }, { span: 2 }, { span: 3 }, { span: 4 }],
    },
    column: {
      span: '4',
      subcategories: [
        {
          '': [
            {
              image: { span: 2 },
            },
          ],
        },
      ],
    },
    hideMegaNav: () => {},
  }

  const renderComponent = buildComponentRender(shallowRender, Column)

  it('should render default state', () => {
    expect(renderComponent(requiredProps).getTree()).toMatchSnapshot()
  })

  it('should not Render Content component when show is false', () => {
    const { wrapper } = renderComponent({ ...requiredProps, isActive: false })
    expect(wrapper.find(Content)).toHaveLength(0)
  })

  it('should not return Content nor any links when no columns passed', () => {
    const { wrapper } = renderComponent({ ...requiredProps, column: {} })
    expect(wrapper.find(Content)).toHaveLength(0)
    expect(wrapper.find('a')).toHaveLength(0)
  })

  it('Content div parent should have 50% width when image span in categories is 2', () => {
    const { wrapper } = renderComponent(requiredProps)
    expect(
      wrapper.find('div.MegaNav-column').get(0).props.style
    ).toHaveProperty('width', '50%')
  })

  it('last element of Content wrapper, div, should have class "MegaNav-lastColumn"', () => {
    const { wrapper } = renderComponent(requiredProps)
    expect(wrapper.find('div.MegaNav-lastColumn')).toHaveLength(1)
  })
})
