import testComponentHelper from 'test/unit/helpers/test-component'
import PasswordCriteriaIndicator from '../PasswordCriteriaIndicator'

describe('<PasswordCriteriaIndicator />', () => {
  const renderComponent = testComponentHelper(PasswordCriteriaIndicator)

  describe('@renders', () => {
    it('should render default state', () => {
      const { getTree } = renderComponent()
      expect(getTree()).toMatchSnapshot()
    })

    it('should render visible state', () => {
      const props = { password: 'p' }
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })

    it('should not render the component when `password` is empty', () => {
      const { wrapper } = renderComponent()
      expect(wrapper.find(PasswordCriteriaIndicator)).toHaveLength(0)
    })

    it('should render 4 list items when `password` is not empty', () => {
      const props = { password: 'p' }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('ul li.PasswordCriteriaIndicator-listItem')
      ).toHaveLength(4)
    })

    it('should render 4 list items when `isTouched` is equal to true', () => {
      const props = { isTouched: true }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('ul li.PasswordCriteriaIndicator-listItem')
      ).toHaveLength(4)
    })

    describe('when `password` does not meet the criteria', () => {
      describe('when `isTouched` is equal to false', () => {
        describe('when `password` has less than 8 characters', () => {
          it('should have the default className `PasswordCriteriaIndicator-listItem` on first li', () => {
            const props = { password: 'passwor' }
            const { wrapper } = renderComponent(props)
            expect(
              wrapper
                .find('ul li.PasswordCriteriaIndicator-listItem')
                .at(0)
                .prop('className')
            ).toBe(
              'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem'
            )
          })
        })

        describe('when `password` has no lower case letters', () => {
          it('should have the default className `PasswordCriteriaIndicator-listItem` on second li', () => {
            const props = { password: 'PASSWORD1' }
            const { wrapper } = renderComponent(props)
            expect(
              wrapper
                .find('ul li.PasswordCriteriaIndicator-listItem')
                .at(1)
                .prop('className')
            ).toBe(
              'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem'
            )
          })
        })

        describe('when `password` has no upper case letters', () => {
          it('should have the default className `PasswordCriteriaIndicator-listItem` on third li', () => {
            const props = { password: 'password1' }
            const { wrapper } = renderComponent(props)

            expect(
              wrapper
                .find('ul li.PasswordCriteriaIndicator-listItem')
                .at(2)
                .prop('className')
            ).toBe(
              'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem'
            )
          })
        })

        describe('when `password` has no numbers', () => {
          it('should have the default className `PasswordCriteriaIndicator-listItem` on fourth li', () => {
            const props = { password: 'password' }
            const { wrapper } = renderComponent(props)

            expect(
              wrapper
                .find('ul li.PasswordCriteriaIndicator-listItem')
                .at(3)
                .prop('className')
            ).toBe(
              'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem'
            )
          })
        })
      })

      describe('when `isTouched` is equal to true', () => {
        describe('when `password` has less than 8 characters', () => {
          it('should have the failed className `PasswordCriteriaIndicator-listItem--fail` on first li', () => {
            const props = { password: 'passwor', isTouched: true }
            const { wrapper } = renderComponent(props)
            expect(
              wrapper
                .find('ul li.PasswordCriteriaIndicator-listItem')
                .at(0)
                .prop('className')
            ).toBe(
              'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem PasswordCriteriaIndicator-listItem--fail'
            )
          })
        })

        describe('when `password` has no lower case letters', () => {
          it('should have the failed className `PasswordCriteriaIndicator-listItem--fail` on second li', () => {
            const props = { password: 'PASSWORD1', isTouched: true }
            const { wrapper } = renderComponent(props)
            expect(
              wrapper
                .find('ul li.PasswordCriteriaIndicator-listItem')
                .at(1)
                .prop('className')
            ).toBe(
              'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem PasswordCriteriaIndicator-listItem--fail'
            )
          })
        })

        describe('when `password` has no upper case letters', () => {
          it('should have the failed className `PasswordCriteriaIndicator-listItem--fail` on third li', () => {
            const props = { password: 'password1', isTouched: true }
            const { wrapper } = renderComponent(props)

            expect(
              wrapper
                .find('ul li.PasswordCriteriaIndicator-listItem')
                .at(2)
                .prop('className')
            ).toBe(
              'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem PasswordCriteriaIndicator-listItem--fail'
            )
          })
        })

        describe('when `password` has no numbers', () => {
          it('should have the fail className `PasswordCriteriaIndicator-listItem--fail` on fourth li', () => {
            const props = { password: 'password', isTouched: true }
            const { wrapper } = renderComponent(props)

            expect(
              wrapper
                .find('ul li.PasswordCriteriaIndicator-listItem')
                .at(3)
                .prop('className')
            ).toBe(
              'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem PasswordCriteriaIndicator-listItem--fail'
            )
          })
        })
      })
    })

    describe('when `password` does meet the criteria', () => {
      describe('when `password` has between 8 and 20 characters', () => {
        it('should have the pass className `PasswordCriteriaIndicator-listItem--pass` on first li', () => {
          const props = { password: 'passwordabcdefghijkl' }
          const { wrapper } = renderComponent(props)
          expect(
            wrapper
              .find('ul li.PasswordCriteriaIndicator-listItem')
              .at(0)
              .prop('className')
          ).toBe(
            'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem PasswordCriteriaIndicator-listItem--pass'
          )
        })
      })

      describe('when `password` has lower case letters', () => {
        it('should have the pass className `PasswordCriteriaIndicator-listItem--pass` on second li', () => {
          const props = { password: 'p' }
          const { wrapper } = renderComponent(props)
          expect(
            wrapper
              .find('ul li.PasswordCriteriaIndicator-listItem')
              .at(1)
              .prop('className')
          ).toBe(
            'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem PasswordCriteriaIndicator-listItem--pass'
          )
        })
      })

      describe('when `password` has upper case letters', () => {
        it('should have the default className `PasswordCriteriaIndicator-listItem--pass` on third', () => {
          const props = { password: 'P' }
          const { wrapper } = renderComponent(props)

          expect(
            wrapper
              .find('ul li.PasswordCriteriaIndicator-listItem')
              .at(2)
              .prop('className')
          ).toBe(
            'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem PasswordCriteriaIndicator-listItem--pass'
          )
        })
      })

      describe('when `password` has numbers', () => {
        it('should have the pass className `PasswordCriteriaIndicator-listItem--pass` on fourth li', () => {
          const props = { password: '2' }
          const { wrapper } = renderComponent(props)

          expect(
            wrapper
              .find('ul li.PasswordCriteriaIndicator-listItem')
              .at(3)
              .prop('className')
          ).toBe(
            'PasswordCriteriaIndicator PasswordCriteriaIndicator-listItem PasswordCriteriaIndicator-listItem--pass'
          )
        })
      })
    })
  })
})
