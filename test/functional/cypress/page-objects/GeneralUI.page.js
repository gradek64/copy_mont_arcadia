export default class GeneralUI {
  get loader() {
    return '.LoaderOverlay .Loader'
  }

  get loaderOverlay() {
    return '.LoaderOverlay'
  }

  get trustArcCookieBanner() {
    return '.trustarc-banner'
  }

  assertLoaderIsNotVisible() {
    cy.get(this.loader).should('not.be.visible')
    return this
  }

  closeTrustArcCookieBanner() {
    cy.get(this.trustArcCookieBanner).then(($banner) => {
      if ($banner) {
        cy.get(this.trustArcCookieBanner).invoke(
          'attr',
          'style',
          'display: none; opacity: 0'
        )
      }
    })
    return this
  }
}
