import DeliveryMethodsContainer from '../DeliveryMethodsContainer'

describe('<DeliveryMethodsContainer />', () => {
  it('should wrap `DeliveryMethods` component', () => {
    expect(
      DeliveryMethodsContainer.WrappedComponent.WrappedComponent.name
    ).toBe('DeliveryMethods')
  })
})
