import bindHandlers from '../bind-handlers'
import * as searchHandlers from './search/search-handlers'

const routeHandlers = {
  ...searchHandlers,
}

export default bindHandlers(routeHandlers)
