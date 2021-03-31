import { compose } from 'ramda'
import {
  mountRender,
  withStore,
  buildComponentRender,
} from 'test/unit/helpers/test-component'

import DDPTCModal from '../DDPTCModal'

describe('<DDPTCModal /> Mounted', () => {
  const testUrl = 'test-t-and-c/Url'
  const createInitialState = () => ({
    config: {
      brandName: 'topshop',
      brandCode: 'tsuk',
    },
    viewport: {
      media: 'mobile',
    },
    routing: {
      visited: [],
    },
    sandbox: {
      pages: {},
    },
    features: {
      status: {},
    },
    espot: {
      cmsData: {
        ddp_terms_and_conditions: {
          responsiveCMSUrl: testUrl,
        },
      },
    },
  })

  const render = compose(
    mountRender,
    withStore(createInitialState())
  )
  const renderEspotModal = buildComponentRender(render, DDPTCModal)

  it('renders', () => {
    const { getTree } = renderEspotModal()
    expect(getTree()).toMatchSnapshot()
  })

  it('renders the ddp_terms_and_conditions component', () => {
    const { wrapper } = renderEspotModal()
    const modal = wrapper.find('div[data-espot="ddp_terms_and_conditions"]')
    expect(modal).not.toBeNull()
    expect(modal).toHaveLength(1)
  })
})
