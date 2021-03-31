import psd2OrderPunchoutHandler from '../psd2-order-punchout-handler'

jest.mock('../server-side-renderer', () => ({
  serverSideRendererLite: jest.fn(),
}))

import { serverSideRendererLite } from '../server-side-renderer'

describe('psd2OrderPunchoutHandler', () => {
  it('uses serverSideRendererLite to render the punchout handlebars template', async () => {
    const reply = jest.fn()
    const request = {}

    await psd2OrderPunchoutHandler(request, reply)

    expect(serverSideRendererLite).toHaveBeenCalledWith({
      template: 'punchout',
      buildContext: expect.anything(),
      failureTemplate: 'punchout',
      failureBuildContext: expect.anything(),
      failureCode: 502,
      request,
      reply,
    })
  })
})
