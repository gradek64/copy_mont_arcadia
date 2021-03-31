// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import {last} from 'ramda'

Cypress.Commands.add('filterGtmEvents', (options = {}) => {
    const {filter, timeout = 1000, name} = options
    // Note: we set an increased value on the timeout given the the "then"
    // below as we want our own timeout logic to fail within the Promise,
    // so that we can reject with a custom error message.
    return cy.window().then({timeout: timeout + 1000}, (win) => {
        const dataLayer = win.dataLayer
        return new Promise((resolve, reject) => {
            const start = Date.now()
            const intervalId = setInterval(() => {
                const timePassed = Date.now() - start
                if (timePassed > timeout) {
                    clearInterval(intervalId)
                    reject(
                        `Could not find last '${
                            name != null ? name : 'GTM'
                        }' event within the timeout period (${timeout}).`
                    )
                } else {
                    const event = filter
                        ? last(dataLayer.filter(filter))
                        : last(dataLayer)
                    if (event != null) {
                        clearInterval(intervalId)
                        resolve(event)
                    }
                }
            }, 25)
        })
    })
})
