import React from 'react'
import { shallow } from 'enzyme'
import NavButton from '../NavButton'

const onClick = jest.fn()

describe('<NavButton />', () => {
  describe('nav buttons', () => {
    it('should NOT display them if there are less thumbs than maxVisible', () => {
      const wrapper = shallow(
        <NavButton
          thumbsLength={3}
          maxVisible={10}
          direction="next"
          className="TestClass"
          onClick={onClick}
        />,
        { lifecycleExperimental: true }
      )

      expect(wrapper.find('.TestClass-navContainer')).toHaveLength(0)
    })

    it('should display them if there are more thumbs than maxVisible', () => {
      const wrapper = shallow(
        <NavButton
          thumbsLength={20}
          maxVisible={10}
          direction="next"
          className="TestClass"
          onClick={onClick}
        />,
        { lifecycleExperimental: true }
      )

      expect(wrapper.find('.TestClass-navContainer')).toHaveLength(1)
    })
  })
})
