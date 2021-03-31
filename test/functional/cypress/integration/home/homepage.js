/* eslint-disable localisation */
import DomHeader from '../../page-objects/DomHeader.page.part'
import { isMobileLayout } from '../../lib/helpers'

const head = new DomHeader()

if (isMobileLayout()) {
  describe('Home Page', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('should display link tags with different domains', () => {
      head.assertAltLinksHaveRequiredTags()
    })
  })
}
