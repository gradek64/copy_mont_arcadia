import React from 'react'

import testComponentHelper from 'test/unit/helpers/test-component'

import TsAndCsItem from '../TsAndCsItem'
import Accordion from '../../Accordion/Accordion'

import * as scrollHelper from '../../../../lib/scroll-helper'

const noop = () => {}

jest.mock('../../../../lib/scroll-helper', () => ({
  scrollElementIntoView: jest.fn(),
}))

describe('<TsAndCsItem />', () => {
  const requiredProps = {
    item: {
      heading: <p>Header</p>,
      '2ndlevel': [],
    },
    fragment: 'fragment',
    location: {
      hash: '',
    },
    toggleAccordion: noop,
  }
  const renderComponent = testComponentHelper(TsAndCsItem.WrappedComponent)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render 2nd level items', () => {
      const { getTree } = renderComponent({
        ...requiredProps,
        item: {
          ...requiredProps.item,
          '2ndlevel': [
            {
              subHeading: 'UK Delivery',
              markup: '<p>abc</p>',
            },
            {
              subHeading: 'Free Standard Delivery',
              markup: '<p>lmn</p>',
            },
          ],
        },
      })
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('componentDidMount', () => {
      describe('if `fragment` equals the location hash', () => {
        const testProps = {
          fragment: 'fragment',
          location: {
            hash: '#fragment',
          },
        }
        it('should render expanded accordion', () => {
          const { wrapper, instance } = renderComponent({
            ...requiredProps,
            ...testProps,
          })
          instance.componentDidMount()
          expect(wrapper.find(Accordion).prop('expanded')).toBe(true)
        })

        it('should call `scrollElementIntoView` with the component ref and `1`', () => {
          const { instance } = renderComponent({
            ...requiredProps,
            ...testProps,
          })
          const tsAndCsItemRef = {}
          instance.tsAndCsItem = tsAndCsItemRef
          instance.componentDidMount()
          expect(scrollHelper.scrollElementIntoView).toHaveBeenCalledWith(
            tsAndCsItemRef,
            1
          )
        })
      })
    })
  })
})
