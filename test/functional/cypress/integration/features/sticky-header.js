// import config from '../../../../../build/config'
import homeMocks from '../../mock-helpers/homeMocks'
import { isMobileLayout, setFeature } from '../../lib/helpers'

describe('Sticky headers', () => {
  before(() => {
    cy.task('mock-server-cleanup')
    global.commonMockOverrides = homeMocks
  })
  after(() => {
    global.commonMockOverrides = undefined
  })
  const brandToUrl = {
    topshop: 'http://local.m.topshop.com',
    topman: 'http://local.m.topman.com',
    dorothyperkins: 'http://local.m.dorothyperkins.com',
    missselfridge: 'http://local.m.missselfridge.com',
    wallis: 'http://local.m.wallis.co.uk',
    evans: 'http://local.m.evans.co.uk',
    burton: 'http://local.m.burton.co.uk',
  }

  // TODO run this test for each brand - OE-2376
  // config.get('brands')
  ;['topshop'].forEach((brand) => {
    it(`sticky header - ${brand}`, () => {
      cy.visit(`${brandToUrl[brand]}:${Cypress.env('PORT')}`)

      if (isMobileLayout()) {
        setFeature('FEATURE_STICKY_MOBILE_HEADER', true)

        cy.log('scrollTo: y = 300px')
        cy.scrollTo(0, 300)
        cy.get('.BrandLogo-img').should('be.visible')

        cy.scrollTo(0, 0)
        setFeature('FEATURE_STICKY_MOBILE_HEADER', false)

        cy.log('scrollTo: y = 300px')
        cy.scrollTo(0, 300)

        cy.get('.BrandLogo-img').then((logo) => {
          const rect = logo[0].getBoundingClientRect()

          expect(rect.top).to.be.lte(0)
          expect(rect.bottom).to.be.lte(0)
        })
      } else {
        cy.log('scrollTo: y = 300px')
        cy.scrollTo(0, 300)
        cy.get('.category_208491 > .MegaNav-categoryLink').should('be.visible')
      }
    })
  })
})
