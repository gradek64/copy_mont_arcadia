import { getVisited } from '../routingSelectors'
import { routing as routingMock } from '../../../../../test/mocks/routingMocks'

const snapshot = (action) => expect(action).toMatchSnapshot()

describe('@Routing Selectors', () => {
  const state = {
    routing: routingMock,
  }

  it('[getVisited selector] extract brandName from config', () => {
    snapshot(getVisited(state))
  })

  it('[getVisited selector] return empty when state is empty', () => {
    expect(getVisited({})).toEqual([])
    expect(getVisited(null)).toEqual([])
    expect(getVisited(undefined)).toEqual([])
  })

  it('[getVisited selector] return lenght 0 when no state', () => {
    expect(getVisited({}).length).toBe(0)
    expect(getVisited(null).length).toBe(0)
    expect(getVisited(undefined).length).toBe(0)
  })
})
