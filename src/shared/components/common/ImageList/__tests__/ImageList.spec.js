import React from 'react'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import testComponentHelper from 'test/unit/helpers/test-component'
import ImageList from '../ImageList'

const renderComponent = testComponentHelper(ImageList.WrappedComponent)

const props = {
  columns: 2,
  isCheckout: false,
  images: [
    {
      target: '_blank',
      alt: 'alt1',
      link: 'http://link1.com',
      source: 'http://image1.jpg',
    },
    {
      target: '_blank',
      alt: 'alt2',
      link: 'http://link2.com',
      source: 'http://image2.jpg',
    },
    {
      target: '_blank',
      alt: 'alt3',
      link: 'link3.com',
      source: 'http://image3.jpg',
    },
  ],
}

describe('Connected component', () => {
  it('should receive the correct props', () => {
    const initialState = {
      routing: {
        location: {
          pathname: '/checkout',
        },
      },
    }
    const container = shallow(
      <ImageList store={configureStore()(initialState)} />
    )
    expect(container).toBeTruthy()
    expect(container.prop('inCheckout')).toBe(true)
  })
})

describe('<ImageList />', () => {
  it('contains a list of links', () => {
    const { wrapper } = renderComponent(props)
    expect(wrapper.find('a')).toHaveLength(2)
  })

  it('should return target blank', () => {
    const { wrapper } = renderComponent({ ...props, inCheckout: true })
    const { props: wrapperProps } = wrapper
      .instance()
      .renderImage({ link: 'http://www.arcadia.com' })
    expect(wrapperProps.target).toBe('_blank')
  })

  it('should return image without link', () => {
    const { wrapper } = renderComponent(props)
    expect(
      wrapper.instance().renderImage({ link: false }).props.className
    ).toBe('ImageList-link')
  })

  it('renders a link with correct props', () => {
    const { wrapper } = renderComponent(props)
    const secondLinkProps = wrapper
      .find('a')
      .at(1)
      .props()
    const secondImageProps = secondLinkProps.children.props

    expect(secondLinkProps.href).toBe('http://link2.com')
    expect(secondLinkProps.style.flexBasis).toBe('50%')
    expect(secondLinkProps.target).toBe('_blank')
    expect(secondImageProps.src).toBe('http://image2.jpg')
    expect(secondImageProps.alt).toBe('alt2')
  })

  it('renders links with target="_blank" if inCheckout', () => {
    const { wrapper } = renderComponent(props)
    expect(
      wrapper
        .find('a')
        .at(0)
        .props().target
    ).toBe('_blank')
  })
})
