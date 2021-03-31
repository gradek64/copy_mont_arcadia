export default (filter, event) => {
  return cy.window().then((window) =>
    cy.log('getLastGtmEventOfType.js', window.dataLayer).then(() => {
      return window.dataLayer
        .filter(
          (element) =>
            event ? element[filter] && element.event === event : element[filter]
        )
        .slice(-1)[0]
    })
  )
}
