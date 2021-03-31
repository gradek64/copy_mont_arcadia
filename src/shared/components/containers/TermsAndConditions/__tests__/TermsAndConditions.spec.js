import testComponentHelper from 'test/unit/helpers/test-component'
import TermsAndConditions from '../TermsAndConditions'
import TsAndCsItem from '../../../common/TsAndCsItem/TsAndCsItem'
import BackToTop from '../../../common/BackToTop/BackToTop'
import TermsAndConditionsMock from './terms-and-conditions-mock.json'

const renderComponent = testComponentHelper(TermsAndConditions)

const props = {
  tsAndCs: TermsAndConditionsMock,
}

describe('<TermsAndConditions />', () => {
  it('displays correctly', () => {
    const { wrapper } = renderComponent(props)
    expect(wrapper.find('.TermsAndConditions')).toHaveLength(1)
    expect(wrapper.find(TsAndCsItem)).toHaveLength(5)
    expect(wrapper.find(BackToTop)).toHaveLength(1)
  })
})
