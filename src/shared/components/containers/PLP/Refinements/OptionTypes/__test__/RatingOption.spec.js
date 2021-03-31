import testComponentHelper from 'test/unit/helpers/test-component'
import { browserHistory } from 'react-router'
import RatingOption from '../RatingOption'
import { analyticsPlpClickEvent } from '../../../../../../analytics/tracking/site-interactions'
import Checkbox from '../../../../../common/FormComponents/Checkbox/Checkbox'

jest.mock('../../../../../../analytics/tracking/site-interactions', () => ({
  analyticsPlpClickEvent: jest.fn(),
}))

describe('<RatingOption />', () => {
  const initialProps = {
    onChange: jest.fn(),
    isMobile: false,
    refinement: 'a refinement',
    selections: ['some', 'selection'],
    options: [{ value: 'an option', seoUrl: '/en/tsuk/some-url' }],
  }
  const renderComponent = testComponentHelper(RatingOption.WrappedComponent)

  it('on selection of a checkbox onChange, onClick and the analytics event are called', () => {
    const { wrapper } = renderComponent(initialProps)
    wrapper
      .find(Checkbox)
      .first()
      .simulate('change')
    expect(analyticsPlpClickEvent).toHaveBeenCalledWith(
      `${initialProps.refinement}-${initialProps.options[0].value}`
    )
  })

  it('should update browser url with new seoUrl when feature flag NEW_FILTER is true', () => {
    const browserHistoryPushSpy = jest
      .spyOn(browserHistory, 'push')
      .mockImplementation(() => {})
    const props = {
      ...initialProps,
      isMobile: false,
    }

    const { instance } = renderComponent(props)

    instance.onClick(
      'Rating',
      '5',
      '/en/tsuk/category/clothing-427/dresses-442/blue/N-85cZdepZdgl'
    )
    expect(browserHistoryPushSpy).toHaveBeenCalledTimes(1)
  })
})
