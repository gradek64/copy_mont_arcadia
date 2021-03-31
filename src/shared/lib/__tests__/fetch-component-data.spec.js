import fetchComponentData from '../fetch-component-data'
import analyticsDecorator from 'src/client/lib/analytics/analytics-decorator'
import { connect } from 'react-redux'

describe('fetchComponentData', () => {
  let dispatch
  let params
  let location
  let cmsPageInfo
  let needArgs
  const ComponentA = () => null
  const ComponentB = () => null

  beforeEach(() => {
    jest.clearAllMocks()

    dispatch = jest.fn()
    params = { paramA: 'foo' }
    location = { host: 'm.topshop.com' }
    cmsPageInfo = { pageInfo: true }
    needArgs = [
      {
        ...location,
        ...params,
        ...cmsPageInfo,
      },
    ]
  })

  const exercise = ({
    components,
    d = dispatch,
    p = params,
    l = location,
    c = cmsPageInfo,
  }) => {
    return fetchComponentData(d, components, { ...p, ...l, ...c })
  }

  it('zero components, no needs', async () => {
    await expect(exercise({ components: [] })).resolves.toEqual([])
  })

  it("calls all components' needs and dispatches the results", async () => {
    jest.spyOn(global, 'clearTimeout')
    const needA = jest.fn(() => ({ type: 'ACTION_A' }))
    const needB = jest.fn(() => ({ type: 'ACTION_B' }))
    const needC = jest.fn(() => ({ type: 'ACTION_C' }))
    ComponentA.needs = [needA, needB, needC]
    ComponentB.needs = [needA]

    await exercise({ components: [ComponentA, ComponentB] })

    ComponentA.needs.forEach((need) => {
      expect(need.mock.calls[0]).toEqual(needArgs)
      expect(dispatch).toHaveBeenCalledWith(need())
    })
    expect(needA.mock.calls[1]).toEqual(needArgs)
    expect(clearTimeout).toHaveBeenCalled()
  })

  it('does not dispatch falsy result of need', async () => {
    ComponentA.needs = [() => null]

    await exercise({ components: [ComponentA] })

    expect(dispatch).not.toHaveBeenCalled()
  })

  describe('calls needs of a wrapped component', () => {
    it('analytics', async () => {
      const needA = jest.fn()
      ComponentA.needs = [needA]
      const CompAWrapped = analyticsDecorator('foo')(ComponentA)

      await exercise({ components: [CompAWrapped] })

      expect(needA).toHaveBeenCalled()
    })

    it('connect', async () => {
      const needA = jest.fn()
      ComponentA.needs = [needA]
      const CompAWrapped = connect()(ComponentA)

      await exercise({ components: [CompAWrapped] })

      expect(needA).toHaveBeenCalled()
    })
  })

  it('rejects if all needs take longer than 2 mins (120 secs) to resolve', async () => {
    jest.useFakeTimers()
    dispatch.mockImplementationOnce((action) => action)
    ComponentA.needs = [
      () =>
        new Promise(() => {
          /* never resolves */
        }),
    ]

    const promise = exercise({ components: [ComponentA] })

    jest.runTimersToTime(120000)

    await expect(promise).rejects.toBeInstanceOf(Error)
  })

  it('fetchComponentData unwraps components and fetches data needs', () => {
    class MockComponent {
      static needs = [() => 'first', () => 'second']
    }

    const dispatch = (action) => action
    const components = [
      {
        WrappedComponent: {
          WrappedComponent: {
            WrappedComponent: { WrappedComponent: MockComponent },
          },
        },
      },
    ]
    return fetchComponentData(dispatch, components).then((result) => {
      expect(result).toEqual(['first', 'second'])
    })
  })
})
