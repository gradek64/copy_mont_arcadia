import { isDesktopLayout } from '../../lib/helpers'
import Navigation from '../../page-objects/Navigation.page'
import Plp from '../../page-objects/Plp.page'

const navigation = new Navigation()
const plp = new Plp()
const newInProds = 'fixture:plp/products--newInThisWeek-2169932'

if (isDesktopLayout()) {
  describe('megaNav functions properly', () => {
    beforeEach(() => {
      plp.mocksForProductList({
        productNavigation: newInProds,
      })
      cy.visit('/')
    })

    it('Should render category links', () => {
      cy.get(navigation.navCategoryLink)
        .eq(2)
        .should('not.have.length', '0')
    })

    it('Should open subnav onHover of a nav link', () => {
      navigation.mouseOver(navigation.navCategory, 2)
      cy.get(navigation.subNav).should('be.visible')
    })

    it('Should close the previous subNav when hovered over another category link', () => {
      navigation.mouseOver(navigation.navCategory, 2)

      cy.get(navigation.subNav)
        .eq(2)
        .should('be.visible')

      navigation.mouseOver(navigation.navCategory, 3)

      cy.get(navigation.subNav)
        .eq(3)
        .should('be.visible')

      cy.get(navigation.subNav)
        .eq(2)
        .should('not.be.visible')
    })

    it('Should render new page onClick of subNav link', () => {
      navigation.mouseOver(navigation.navCategoryLink, 2)
      navigation.click(navigation.navCategoryLinkFirst)

      cy.url().should('include', '/en/tsuk/category/')
    })
  })
}
