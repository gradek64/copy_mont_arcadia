import PDP from '../../page-objects/Pdp.page'
import pdpData from './../../fixtures/pdp/imageCarousel.json'
import { isDesktopLayout } from '../../lib/helpers'

if (isDesktopLayout()) {
  describe('Image carousel', () => {
    const pdp = new PDP()
    beforeEach(() => {
      const path = pdp.mocksForPdpProduct({ productByUrl: pdpData })
      cy.visit(path)
    })

    it('should show image gallery modal on click', () => {
      pdp.clickOnImageCarousel()
      pdp.expectModalCarouselToBeOpen()
    })

    it('should open the same image in the modal as selected in the image carousel', () => {
      pdp.clickNextOnImageCarousel()
      pdp.clickOnImageCarousel()

      cy.get(pdp.selectedCarouselImage).then((image) => {
        pdp.expectModalCarouselImageToHaveSrc(image.attr('src'))
      })
    })
  })
}
