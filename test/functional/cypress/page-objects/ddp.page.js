export default class DdpPage {
  get ddpInlineNotificationBelowDeliveryOptions() {
    return '.DDPAppliedToOrderMsg'
  }

  get whyWeNeedThisLink() {
    return '.DeliveryDetailsForm-link'
  }

  get addDdpToBagBtn() {
    return '.CTA-anchor .CTA-primary'
  }

  /**
   * ASSERTIONS *******************
   */
  assertDDPInlineNotification(visibility = 'be.visible', text = 'have.text') {
    cy.get(this.ddpInlineNotificationBelowDeliveryOptions)
      .should(visibility)
      .and(
        text,
        'Great news! Topshop Unlimited has been applied to your order.Take advantage of your delivery perks right away!'
      )
    return this
  }

  assertWhyWeNeedThisLink(visibility = 'be.visible') {
    cy.get(this.whyWeNeedThisLink).should(visibility)
    return this
  }

  assertDDPoptions(visibility = 'be.visible') {
    cy.get('.DeliveryDetailsForm-link').should(visibility)
    cy.get('.CTA-anchor .CTA-primary').should(visibility)
    return this
  }

  assertDressipiRecommendationsCarousel() {
    cy.get('.Recommendations').should('have.class', 'Dressipi')
    return this
  }
}
