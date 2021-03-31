import testComponentHelper from 'test/unit/helpers/test-component'

import RefinementList from '../RefinementList'
import Accordion from '../../../../common/Accordion/Accordion'

describe('<RefinementList/>', () => {
  const renderComponent = testComponentHelper(RefinementList.WrappedComponent)
  const refinements = [
    {
      label: 'Colour',
      refinementOptions: [
        {
          type: 'VALUE',
          label: 'black',
          value: 'black',
        },
      ],
    },
    {
      label: 'Size',
      refinementOptions: [
        {
          type: 'VALUE',
          label: 4,
          value: 4,
        },
        {
          type: 'VALUE',
          label: 6,
          value: 6,
        },
      ],
    },
    {
      label: 'Price',
      refinementOptions: [
        {
          type: 'RANGE',
          label: 0,
          value: 0,
        },
      ],
    },
  ]
  const defaultProps = {
    refinements,
    removeOptionRange: jest.fn(),
    getActiveRefinements: [],
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(defaultProps).getTree()).toMatchSnapshot()
    })
    it('with selectedOptions', () => {
      const selectedOptions = {
        Size: [4],
      }
      expect(
        renderComponent({ ...defaultProps, selectedOptions }).getTree()
      ).toMatchSnapshot()
    })
    it('with onChange function', () => {
      expect(
        renderComponent({ ...defaultProps, onChange: jest.fn() }).getTree()
      ).toMatchSnapshot()
    })
    it('with not correct refinement label', () => {
      const props = {
        refinements: [
          {
            label: 'Not valid',
            refinementOptions: [
              {
                label: 'black',
                value: 'black',
              },
            ],
          },
        ],
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('with not correct refinement label and not mobile', () => {
      const props = {
        refinements: [
          {
            label: 'Not valid',
            refinementOptions: [
              {
                label: 'black',
                value: 'black',
              },
            ],
          },
        ],
        isMobile: false,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('with no refinementOptions', () => {
      const props = {
        refinements: [
          {
            label: 'Size',
            refinementOptions: [],
          },
        ],
        getActiveRefinements: [],
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('if not isMobile, AccordionGroup should be singleOpen', () => {
      expect(
        renderComponent({ ...defaultProps, isMobile: false }).getTree()
      ).toMatchSnapshot()
    })

    it('if `isMobile` prop is `false`, should set <Accordion /> `noHeaderPadding` prop to `true`', () => {
      const { wrapper } = renderComponent({ ...defaultProps, isMobile: false })
      wrapper.find(Accordion).forEach((accordion) => {
        expect(accordion.prop('noHeaderPadding')).toBe(true)
      })
    })
  })

  describe('@functions', () => {
    describe('@selectionText', () => {
      it('with no selections', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.selectionText(null, 'SIZE')
        expect(result).toBe('')
      })
      it('with selections as not array', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.selectionText({}, 'SIZE')
        expect(result).toBe('')
      })
      it('with type as SIZE', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.selectionText([4, 6], 'SIZE')
        expect(result).toBe('4, 6')
      })
      it('with type as VALUE', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.selectionText(['black', 'green'], 'VALUE')
        expect(result).toBe('Black, Green')
      })
      it('with type as RATING as 5', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.selectionText([5], 'RATING')
        expect(result).toBe('5 stars')
      })
      it('with type as RATING as not 5', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.selectionText([3], 'RATING')
        expect(result).toBe('3 stars & up')
      })
      it('with type as RANGE', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.selectionText([80, 90], 'RANGE')

        expect(result).toMatchSnapshot()
      })
      it('with other type', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.selectionText(['something'], 'SOMETYPE')
        expect(result).toBe('Something')
      })
    })
    describe('@setRefinementType', () => {
      it('with type as Rating', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.setRefinementType([], 'Rating')
        expect(result).toBe('RATING')
      })
      it('with type as Size', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.setRefinementType([], 'Size Guide')
        expect(result).toBe('SIZE')
      })
      it('with other type and empty options', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.setRefinementType([], 'Other')
        expect(result).toBe('')
      })
      it('with other type and not empty options', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.setRefinementType(
          [{ type: 'sometype' }],
          'Other'
        )
        expect(result).toBe('sometype')
      })
    })
    describe('@returnInitiallyExpanded', () => {
      it('should return empty array if isMobile', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.returnInitiallyExpanded(true, refinements)
        expect(result).toEqual([])
      })
      it('should return Price label in array if not isMobile', () => {
        const { instance } = renderComponent(defaultProps)
        const result = instance.returnInitiallyExpanded(false, refinements)
        expect(result).toEqual(['Price'])
      })
      it('should return empty array if not isMobile, but no Price', () => {
        const refinements = [
          {
            label: 'Colour',
            refinementOptions: [
              {
                type: 'VALUE',
                label: 'black',
                value: 'black',
              },
            ],
          },
          {
            label: 'Size',
            refinementOptions: [
              {
                type: 'VALUE',
                label: 4,
                value: 4,
              },
              {
                type: 'VALUE',
                label: 6,
                value: 6,
              },
            ],
          },
        ]
        const { instance } = renderComponent(defaultProps)
        const result = instance.returnInitiallyExpanded(false, refinements)
        expect(result).toEqual([])
      })
      it('should return Price label in array if not isMobile, minus empty refinements count', () => {
        const refinements = [
          {
            label: 'Filter',
            refinementOptions: [],
          },
          {
            label: 'Colour',
            refinementOptions: [
              {
                type: 'VALUE',
                label: 'black',
                value: 'black',
              },
            ],
          },
          {
            label: 'Price',
            refinementOptions: [
              {
                type: 'RANGE',
                label: 0,
                value: 0,
              },
            ],
          },
        ]
        const { instance } = renderComponent(defaultProps)
        const result = instance.returnInitiallyExpanded(false, refinements)
        expect(result).toEqual(['Price'])
      })
      it('should return all selected labels', () => {
        const refinements = [
          {
            label: 'Filter',
            refinementOptions: [],
          },
          {
            label: 'Colour',
            refinementOptions: [
              {
                type: 'VALUE',
                label: 'black',
                value: 'black',
                selectedFlag: true,
              },
            ],
          },
          {
            label: 'Price',
            refinementOptions: [
              {
                type: 'RANGE',
                label: 0,
                value: 0,
              },
            ],
          },
        ]
        const { instance } = renderComponent(defaultProps)
        const result = instance.returnInitiallyExpanded(false, refinements)
        expect(result).toEqual(['Colour', 'Price'])
      })
      it('should handle duplicate labels', () => {
        const props = {
          refinements: [
            {
              refinementOptions: [],
              label: 'key1',
            },
          ],
          selectedOptions: {
            key1: ['A', 'B', 'A'],
          },
          isMobile: true,
        }
        expect(renderComponent(props).getTree()).toMatchSnapshot()
      })
      it('should handle duplicate mobile refinements', () => {
        const props = {
          refinements: [
            {
              refinementOptions: [],
              label: 'key1',
            },
          ],
          selectedOptions: {
            key1: ['A', 'B'],
          },
          isMobile: true,
        }
        expect(renderComponent(props).getTree()).toMatchSnapshot()
      })
      it('should handle duplicate desktop refinements', () => {
        const props = {
          refinements: [
            {
              refinementOptions: [],
              label: 'key1',
            },
          ],
          productRefinements: {
            label: 'key',
            refinementOptions: [],
          },
          selectedOptions: {
            key1: ['A', 'B'],
          },
          isMobile: false,
        }
        expect(renderComponent(props).getTree()).toMatchSnapshot()
      })
    })
    describe('@parseSelectedRefinements', () => {
      it('should return array with value from refinementOptions', () => {
        const refinementOptions = [
          {
            type: 'VALUE',
            label: 'black',
            selectedFlag: true,
          },
          {
            type: 'VALUE',
            label: 'red',
          },
          {
            type: 'VALUE',
            label: 'blue',
            selectedFlag: true,
          },
        ]
        const { instance } = renderComponent(defaultProps)
        const expectedResult = ['black', 'blue']

        expect(instance.parseSelectedRefinements(refinementOptions)).toEqual(
          expectedResult
        )
      })
    })

    describe('@blockRefinementItem', () => {
      it('should return false if "type" is empty string', () => {
        const type = ''
        const refinementOptions = []
        const { instance } = renderComponent(defaultProps)
        expect(
          instance.blockRefinementItem(type, refinementOptions)
        ).toBeTruthy()
      })

      it('should return false if "type" is undefined', () => {
        const type = undefined
        const refinementOptions = []
        const { instance } = renderComponent(defaultProps)
        expect(
          instance.blockRefinementItem(type, refinementOptions)
        ).toBeTruthy()
      })

      it('should return true if minValue is less than maxValue', () => {
        const type = 'RANGE'
        const refinementOptions = [
          {
            minValue: '10',
            maxValue: '100',
          },
        ]
        const { instance } = renderComponent(defaultProps)
        expect(
          instance.blockRefinementItem(type, refinementOptions)
        ).toBeFalsy()
      })

      it('should return true if minValue is equal to maxValue', () => {
        const type = 'RANGE'
        const refinementOptions = [
          {
            minValue: '100',
            maxValue: '100',
          },
        ]
        const { instance } = renderComponent(defaultProps)
        expect(
          instance.blockRefinementItem(type, refinementOptions)
        ).toBeTruthy()
      })

      it('should return true if minValue is greater than maxValue', () => {
        const type = 'RANGE'
        const refinementOptions = [
          {
            minValue: '100',
            maxValue: '10',
          },
        ]
        const { instance } = renderComponent(defaultProps)
        expect(
          instance.blockRefinementItem(type, refinementOptions)
        ).toBeTruthy()
      })

      it('should return false if if type is ""', () => {
        const type = 'VALUE'
        const refinementOptions = [
          {
            label: 'black',
            value: 'black',
          },
        ]
        const { instance } = renderComponent(defaultProps)
        expect(
          instance.blockRefinementItem(type, refinementOptions)
        ).toBeFalsy()
      })
    })
  })
})
