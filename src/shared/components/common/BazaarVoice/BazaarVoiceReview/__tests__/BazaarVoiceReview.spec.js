import React from 'react'
import { mount } from 'enzyme'
import { analyticsDecoratorHelper } from '../../../../../../../test/unit/helpers/test-component'

import BazaarVoiceReview from '../BazaarVoiceReview'

describe('<BazaarVoiceReview />', () => {
  describe('@decorators', () => {
    analyticsDecoratorHelper(BazaarVoiceReview, 'write-a-review', {
      componentName: 'BazaarVoiceReview',
      isAsync: false,
    })
  })

  describe('@render', () => {
    test('<BazaarVoicereview contains the correct specific bazaar voice ids />', () => {
      const {
        WrappedComponent: { WrappedComponent },
      } = BazaarVoiceReview
      const mountedComponent = mount(
        <WrappedComponent brandCode="tsuk" bvToken="randomline" />
      )
      expect(mountedComponent.find('#BVSubmissionContainer').length).toBe(1)
    })
  })
})
