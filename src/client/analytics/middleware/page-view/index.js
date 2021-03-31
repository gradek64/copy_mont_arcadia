import { addPostDispatchListeners } from '../analytics-middleware'
import { pageLoadedListener } from './page-loaded-listener'

export default () => {
  addPostDispatchListeners('PAGE_LOADED', pageLoadedListener)
}
