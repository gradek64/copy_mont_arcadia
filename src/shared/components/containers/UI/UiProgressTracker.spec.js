import testComponentHelper from 'test/unit/helpers/test-component'
import UiProgressTracker from './UiProgressTracker'

describe('<UiProgressTracker />', () => {
  describe('@renders', () => {
    const renderComponent = testComponentHelper(UiProgressTracker)
    it('in default state', () => {
      expect(renderComponent().getTree()).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    const renderComponent = testComponentHelper(UiProgressTracker)
    describe('onSelectExample', () => {
      it('select the correct example', () => {
        const event = { target: { value: 'Example 4 Steps' } }
        const { wrapper, instance } = renderComponent()
        wrapper.find('select[name="examples"]').simulate('change', event)
        expect(instance.state.steps).toEqual([
          'Step0',
          'Step1',
          'Step2',
          'Step3',
        ])
      })
    })
    describe('onSelectActiveStep', () => {
      it('select the correct index', () => {
        const event = { target: { value: 2 } }
        const { wrapper, instance } = renderComponent()
        wrapper.find('select[name="indexes"]').simulate('change', event)
        expect(instance.state.activeStepIdx).toEqual(event.target.value)
      })
    })
  })
})
