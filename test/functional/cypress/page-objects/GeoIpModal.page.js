export default class GeoIpModal {
  get modalWrapper() {
    return '.Modal .GeoIP'
  }

  get dismissButton() {
    return '.Modal > .Modal-closeIcon > span'
  }

  get remainCTA() {
    return '.GeoIP-optionBtn:first-of-type'
  }

  get redirectionCTA() {
    return '.GeoIP-optionBtn:last-of-type'
  }

  get loaderImage() {
    return '.Loader-image'
  }

  get loaderOverlay() {
    return '.LoaderOverlay'
  }

  get title() {
    return '.GeoIP-title'
  }

  get footnote() {
    return '.GeoIP-footnote'
  }

  /**
   * USER ACTIONS **************************************************************
   */

  clickDismissButton() {
    cy.get(this.dismissButton).click({ force: true })
    return this
  }

  clickRedirectionCTA() {
    cy.get(this.redirectionCTA).click({ force: true })
    return this
  }

  clickRemainCTA() {
    cy.get(this.remainCTA).click({ force: true })
    return this
  }

  /**
   * ASSERTIONS  **************************************************************
   */

  assertModalWrapper(visibility) {
    cy.get(this.modalWrapper).should(visibility)
    return this
  }

  assertLoaderOverlayVisible(isVisible) {
    if (isVisible === true) {
      cy.get(this.loaderImage).should('be.visible')
      cy.get(this.loaderOverlay).should('be.visible')
    } else {
      cy.get(this.loaderOverlay).should('not.be.visible')
    }
    return this
  }

  assertModalLanguage(iso) {
    switch (iso) {
      case 'FR':
        cy.get(this.title).contains('Pays de préférence')
        cy.get(this.footnote).contains(
          "Merci de noter : Si vous choisissez d'être redirigé, vous retournerez sur la page d'accueil"
        )
        break

      case 'DE':
        cy.get(this.title).contains('Landeseinstellungen')
        cy.get(this.footnote).contains(
          'Wenn du wählst umgeleitet zu werden, wirst du auf die Startseite des jeweiligen Landes gebracht'
        )
        break

      default:
        cy.get(this.title).contains('Country preferences')
        cy.get(this.footnote).contains(
          'NOTE: If you choose to be redirected, you will be taken to the home page.'
        )
    }
    return this
  }
}
