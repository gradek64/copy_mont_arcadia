import deepFreeze from 'deep-freeze'
import * as espotContent from '../../espotActions'
import * as sandBoxActions from '../../sandBoxActions'
import cmsConsts from '../../../../constants/cmsConsts'

jest.mock('../../sandBoxActions')

const { ESPOT_CONTENT_TYPE } = cmsConsts

describe('setEspotContent', () => {
  const getContentCallMock = jest.fn()
  const responsiveEspotData = deepFreeze([
    { responsiveCMSUrl: 'url1', identifier: 'id1' },
  ])
  const dispatch = jest.fn()
  const getState = jest.fn(() => ({
    config: {},
    viewport: {},
    espot: {
      identifiers: {
        navigation: [],
      },
    },
  }))

  beforeEach(() => {
    jest.resetAllMocks()
    sandBoxActions.getContent.mockReturnValue(getContentCallMock)
  })

  it('should call getContent method for each responsive url', () =>
    espotContent
      .setEspotContent(responsiveEspotData)(dispatch, getState)
      .then(() => {
        const { responsiveCMSUrl } = responsiveEspotData[0]
        expect(sandBoxActions.getContent).toHaveBeenCalledTimes(1)
        expect(sandBoxActions.getContent).toHaveBeenCalledWith(
          {
            pathname: responsiveCMSUrl,
            query: {
              responsiveCMSUrl,
            },
          },
          null,
          ESPOT_CONTENT_TYPE
        )
        expect(getContentCallMock).toHaveBeenCalledWith(dispatch, getState)
      }))

  it('should not call getContent method when responsive url is not provided', () =>
    espotContent
      .setEspotContent([
        {
          responsiveCMSUrl: null,
        },
      ])(dispatch, getState)
      .then((response) => {
        expect(response).toEqual([null])
        expect(getContentCallMock).not.toHaveBeenCalled()
      }))
})
