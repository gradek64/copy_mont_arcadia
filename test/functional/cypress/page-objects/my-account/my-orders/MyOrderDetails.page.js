import MyAccountStart from '../MyAccount.Page'

export default class MyOrderDetails extends MyAccountStart {
  myAccountStart = new MyAccountStart()

  get orderReturnsButton() {
    return '.HistoryDetailsContainer-returns a'
  }

  get trackOrderButton() {
    return '.Button--trackOrder.enabled'
  }

  get notYetDispatchedButton() {
    return '.Button--trackOrder.Button--isDisabled'
  }

  get orderStatusMessage() {
    return '.HistoryDetailsContainer-orderStatus > .sessioncamhidetext'
  }

  get deliveryPartStatusLabel() {
    return '.HistoryDetailsContainer-orderDeliveryLabel'
  }

  get deliveryEstimateMessage() {
    return '.HistoryDetailsContainer-header .HistoryDetailsContainer-orderStatus'
  }

  get toBeDeliveredMessage() {
    return '.HistoryDetailsContainer-header'
  }

  get orderItemsNoTracking() {
    return '.order-items-no-tracking'
  }

  get orderItemsTracking() {
    return '.order-items-tracking'
  }

  get historyDetailsContainerList() {
    return '.HistoryDetailsContainer-list'
  }
  /**
   * ACTIONS  **************************************************************
   */

  navigateToOrderDetails(urls) {
    this.myAccountStart.clickNavigation(urls.myOrders)
    cy.wait('@order-history')
    this.myAccountStart.clickNavigation(urls.myOrderDetails)
    cy.wait('@order-history-details')
  }

  clickStartReturn() {
    cy.get(this.orderReturnsButton)
      .invoke('removeAttr', 'target')
      .click()
  }

  navigateToOrderHistory(orderNumber = '') {
    const orderHistoryUrl = {
      url: `/my-account/order-history${orderNumber}`,
    }
    this.myAccountStart.clickNavigation(orderHistoryUrl.url)
    return this
  }

  wait(wait) {
    cy.wait(wait)
    return this
  }

  /**
   * ASSERTIONS  **************************************************************
   */

  assertStartReturnLink(orderNumber, postCode) {
    cy.get(this.orderReturnsButton)
      .should('be.visible')
      .should('have.attr', 'href')
      .and('include', orderNumber)
      .and('include', postCode)
  }

  assertNoReturnLink() {
    cy.get(this.orderReturnsButton).should('not.be.visible')
  }

  /**
   * ASSERTIONS - TRACK MY ORDER  **************************************************************
   */

  /**
   * Check the button is visible for tracking
   * @param trackingContainerGrouping
   * @param orderNumber
   * @returns {MyOrderDetails}
   */
  assertTrackOrderButtonVisibility(trackingContainerGrouping, orderNumber) {
    cy.get(`[data-shipment-order="${trackingContainerGrouping}"]`)
      .children(this.trackOrderButton)
      .contains('TRACK MY ORDER')
      .should('have.length', 1)
      .should('be.visible')
      .should('have.attr', 'href')
      .and('include', `FLT0${orderNumber}`)

    cy.get(`[data-shipment-order="${trackingContainerGrouping}"]`)
      .children(this.trackOrderButton)
      .should('have.attr', 'target', '_blank')

    return this
  }

  /**
   * Check if not yet dispatched button is available in the no tracking container
   * @returns {MyOrderDetails}
   */
  assertNotYetDispatchedContainer() {
    cy.get(this.orderItemsNoTracking)
      .children(this.notYetDispatchedButton)
      .should('have.length', 1)
      .should('be.visible')
      .contains('NOT YET DISPATCHED')

    cy.get('.Button--trackOrder')
      .its('length')
      .then((size) => {
        if (size > 1) {
          cy.get('.order-items-no-tracking')
            .children(this.toBeDeliveredMessage)
            .should('contain', 'Remaining items to be delivered')
        }
      })
    return this
  }

  /**
   * Check if button is disabled on the page
   * @param trackingEnabled
   */
  assertTrackingDisabled(trackingEnabled) {
    if (trackingEnabled) {
      cy.get(this.orderItemsNoTracking)
        .children(this.notYetDispatchedButton)
        .should('not.be.visible')

      cy.get(this.orderItemsNoTracking)
        .children(this.trackOrderButton)
        .should('not.be.visible')
    } else {
      cy.get(this.historyDetailsContainerList)
        .children(this.notYetDispatchedButton)
        .should('not.be.visible')

      cy.get(this.historyDetailsContainerList)
        .children(this.trackOrderButton)
        .should('not.be.visible')
    }
  }

  /**
   * Count the amount of products within each area dependant on tracking of each order line
   * @param trackingContainerGrouping
   * @param numberOfProducts
   * @param trackingEnabled
   */
  assertContainerProductCount(
    trackingContainerGrouping,
    numberOfProducts,
    trackingEnabled
  ) {
    if (trackingEnabled) {
      cy.get(this.orderItemsTracking)
        .find(`[data-shipment-order="${trackingContainerGrouping}"]`)
        .find('.OrderHistoryDetailsElement')
        .should('have.length', numberOfProducts)
    } else if (!trackingEnabled) {
      cy.get(this.orderItemsNoTracking)
        .find('.OrderHistoryDetailsElement')
        .should('have.length', numberOfProducts)
    } else {
      cy.get(this.historyDetailsContainerList)
        .find('.OrderHistoryDetailsElement')
        .should('have.length', numberOfProducts)
    }
  }

  /**
   * check the delivery number message
   * @param trackingContainerGrouping
   */
  assertDeliveryMessage(trackingContainerGrouping) {
    cy.get(`[data-shipment-order="${trackingContainerGrouping}"]`)
      .get(this.deliveryPartStatusLabel)
      .should('contain', 'Delivery')
      .should('contain', `${trackingContainerGrouping}:`)
  }

  /**
   * Assert order section
   * @param orderNumber
   * @param trackingContainerGrouping
   * @param numberOfProducts
   * @param trackingEnabled
   * @returns {MyOrderDetails}
   */
  assertTrackingContainerContents(
    orderNumber,
    trackingContainerGrouping,
    numberOfProducts,
    trackingEnabled
  ) {
    // check the button assertions
    switch (trackingEnabled) {
      case true:
        this.assertTrackOrderButtonVisibility(
          trackingContainerGrouping,
          orderNumber
        )
        this.assertDeliveryMessage(trackingContainerGrouping)
        break

      case false:
        this.assertNotYetDispatchedContainer()
        break

      default:
        this.assertTrackingDisabled(trackingEnabled)
    }

    // check the product counts
    this.assertContainerProductCount(
      trackingContainerGrouping,
      numberOfProducts,
      trackingEnabled
    )
    return this
  }

  waitThenAssertHeaderRender(wait) {
    cy.wait(wait).then((xhr) => {
      cy.get(this.orderStatusMessage).should(
        'contain',
        xhr.response.body.status
      )
      cy.get(this.deliveryEstimateMessage)
        .should('contain', xhr.response.body.deliveryDate)
        .and('contain', xhr.response.body.deliveryMethod)
    })
    return this
  }
}
