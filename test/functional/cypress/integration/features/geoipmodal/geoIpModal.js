import { visitPageWithGeoLocation, isMobileLayout } from '../../../lib/helpers'
import * as EventFilters from '../../../lib/filters'

import GeoIpModal from '../../../page-objects/GeoIpModal.page'

const geoIpModal = new GeoIpModal()

if (isMobileLayout()) {
  describe('Country selections from GeoIP modal', () => {
    describe('Visiting France from the UK', () => {
      beforeEach(() => {
        visitPageWithGeoLocation('FR')
      })

      it('should not redirect if I choose to remain on the UK site', () => {
        geoIpModal.assertModalWrapper('be.visible').clickRemainCTA()
        cy.location('hostname').should('eq', 'local.m.topshop.com')
      })

      it('should display loader overlay content when I select dismiss button', () => {
        geoIpModal.clickDismissButton().assertLoaderOverlayVisible(true)
      })

      it('should create a new "geoIpModal" event when geoIPModal is displayed', () => {
        cy.filterGtmEvents({
          filter: EventFilters.gaEvent('geoIpModal'),
          timeout: 8000,
        }).then((event) => {
          expect(event.event).to.equal('geoIpModal')
          expect(event.currentLocale).to.equal('uk')
          expect(event.suggestedLocale).to.equal('fr')
        })
      })
    })

    describe('Internationalisation Feature', () => {
      it('should not display GeoIP Modal when I visit the UK from UK (no GEOIP cookie)', () => {
        visitPageWithGeoLocation('GB')
        geoIpModal.assertModalWrapper('not.exist')
      })

      it('should not display GeoIP Modal when I visit the UK from UK (GEOIP cookie = GB)', () => {
        cy.setCookie('GEOIP', 'GB')
        visitPageWithGeoLocation('GB')
        geoIpModal.assertModalWrapper('not.exist')
      })

      it('should not display GeoIP Modal when I visit the UK from UK (GEOIP cookie = FR)', () => {
        cy.setCookie('GEOIP', 'FR')
        visitPageWithGeoLocation('GB')
        geoIpModal.assertModalWrapper('not.exist')
      })

      it('should not display GeoIP Modal when I visit from France (GEOIP cookie = UK)', () => {
        cy.setCookie('GEOIP', 'GB')
        visitPageWithGeoLocation('FR')
        geoIpModal.assertModalWrapper('not.exist')
      })

      it('should display language as French when I visit the UK site from France (no GEOIP cookie)', () => {
        visitPageWithGeoLocation('FR')
        geoIpModal.assertModalLanguage('FR').clickRedirectionCTA()

        cy.location().should((location) => {
          expect(location.hostname).to.eq('local.m.fr.topshop.com')
          expect(location.search).to.eq(
            '?internationalRedirect=geoIPModal-tsuk'
          )
        })
      })

      it('should display language as German if I am in Germany (with a German cookie) and I visit the UK site', () => {
        cy.setCookie('GEOIP', 'DE')
        visitPageWithGeoLocation('DE')
        geoIpModal.assertModalLanguage('DE').clickRedirectionCTA()

        cy.location().should((location) => {
          expect(location.hostname).to.eq('local.m.de.topshop.com')
          expect(location.search).to.eq(
            '?internationalRedirect=geoIPModal-tsuk'
          )
        })
      })
    })
  })
}
