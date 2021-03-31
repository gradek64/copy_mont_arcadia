import { browserHistory } from 'react-router'

export const redirect = (location, statusCode = 307) => (
  dispatch,
  getState,
  context
) => {
  if (process.browser) {
    browserHistory.replace({ pathname: location })
  } else {
    context.setRedirect(location, statusCode)
  }
}
