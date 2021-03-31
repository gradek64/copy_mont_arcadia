// TODO: Move this file to ../ (main selectors folder) https://arcadiagroup.atlassian.net/browse/PTM-575

import { pathOr } from 'ramda'

export const getVisited = (state) => {
  return pathOr([], ['routing', 'visited'], state)
}
