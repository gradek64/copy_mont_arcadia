import * as actions from '../PlpContainerActions'

const snapshot = (action) => expect(action).toMatchSnapshot()

describe('PlpContainerActions', () => {
  it('plpPropsRefresh', () => {
    snapshot(actions.plpPropsRefresh())
  })
})
