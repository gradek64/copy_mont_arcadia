import { getCommonRoutes } from '../../mock-server/routes'
import { setupServerMocks } from '../lib/helpers'

export const commonMocks = (mapRoutes = (x) => x) => {
  const routes = mapRoutes(getCommonRoutes())
  setupServerMocks(routes).then(() => {
    cy.server()
    routes.map(cy.route)
  })
}
