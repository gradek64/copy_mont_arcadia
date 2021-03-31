import { get } from '../../lib/api-service'
import navigationConsts from '../../constants/navigation'
import { localise } from '../../lib/localisation'
import { setGenericError, setApiError } from './errorMessageActions'
import { setNavigationEspots } from './espotActions'
import { isMobile } from '../../selectors/viewportSelectors'
import { isUserAuthenticated } from '../../selectors/userAuthSelectors'

/**
 * If "userHasUnlogged" = true then the scenario is the one where the User clicked on "Sign out" and
 * then we need to modify the User details menu group in the store in order to show "Sign in or register" in the navigation menu.
 * If otherwise "userHasUnlogged" = false then the scenario is the one where the User has logged in
 * and then we need to modify the User details menu group in the store to show "Sign out" in the navigation menu.
 */
function updateMenuUserDetails(userAuthenticated) {
  return (dispatch, getState) => {
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    const userDetailsGroup = getState().navigation[
      navigationConsts.USER_DETAILS_GROUP_TYPE
    ]
    const signinItemAr = userDetailsGroup.filter((item) => {
      const labelToModify = userAuthenticated
        ? l(navigationConsts.SIGN_IN_OR_REGISTER_LABEL)
        : l(navigationConsts.LOGOUT_LABEL)
      return item.label.toLowerCase() === labelToModify.toLowerCase()
    })
    if (signinItemAr.length) {
      const signinItemIndex = signinItemAr[0].index - 1
      // Avoiding direct modification of the Store by creating a copy of the "userDetailsGroup" array.
      const newUserDetailsGroup = userDetailsGroup.map((item) => ({ ...item }))
      newUserDetailsGroup[signinItemIndex].label = l(
        userAuthenticated
          ? navigationConsts.LOGOUT_LABEL
          : navigationConsts.SIGN_IN_OR_REGISTER_LABEL
      )
      newUserDetailsGroup[signinItemIndex].redirectionUrl = userAuthenticated
        ? '/logout'
        : '/login'
      dispatch({
        type: 'UPDATE_USER_DETAILS_GROUP',
        newUserDetailsGroup,
      })
    }
  }
}

/**
 * If User logs in then we have to substitute the "Sign in or register" menu link with the
 * "Sign out" link.
 */
export function updateMenuForAuthenticatedUser() {
  return updateMenuUserDetails(true)
}

/**
 * If User logs in then we have to substitute the "Sign out" menu link with the
 * "Sign in or register" link.
 */
export function updateMenuForUnauthenticatedUser() {
  return updateMenuUserDetails(false)
}

const getOnlyLinksToPages = (navigationEntries) => {
  return navigationEntries.reduce((menuLinks, navigationEntry) => {
    if (
      !Array.isArray(navigationEntry.navigationEntries) ||
      navigationEntry.navigationEntries.length === 0
    ) {
      return menuLinks.concat(navigationEntry)
    }
    return menuLinks.concat(
      getOnlyLinksToPages(navigationEntry.navigationEntries)
    )
  }, [])
}

export function getCategories() {
  let productCategories = []
  let userDetailsGroup = []
  let helpAndInfoGroup = []

  return (dispatch, getState) =>
    dispatch(get('/navigation/categories'))
      .then(({ body }) => {
        // We want to obtain an array of the menu items which are not category navigation menu items
        // but are actual navigation menu items links.
        const menuLinks = getOnlyLinksToPages(body)

        if (Array.isArray(body)) {
          // "Shop by category" menu items
          productCategories = body.filter(({ navigationEntryType }) => {
            return navigationEntryType === 'NAV_ENTRY_TYPE_CATEGORY'
          })
          // "Your details" menu items
          const userDetails = body.filter(({ label }) => {
            return label === navigationConsts.YOUR_DETAILS_GROUP_LABEL
          })
          userDetailsGroup =
            (userDetails[0] && userDetails[0].navigationEntries) || []
          // "Help & Information" menu items
          const helpAndInfo = body.filter(({ label }) => {
            return label === navigationConsts.HELP_AND_INFORMATION_GROUP_LABEL
          })
          helpAndInfoGroup =
            (helpAndInfo[0] && helpAndInfo[0].navigationEntries) || []
        }

        dispatch({
          type: 'GET_CATEGORIES',
          menuLinks,
          [navigationConsts.PRODUCT_CATEGORIES_GROUP_TYPE]: productCategories,
          [navigationConsts.USER_DETAILS_GROUP_TYPE]: userDetailsGroup,
          [navigationConsts.HELP_AND_INFO_GROUP_TYPE]: helpAndInfoGroup,
        })

        if (isUserAuthenticated(getState())) {
          dispatch(updateMenuUserDetails(true))
        }
      })
      .catch((error) => {
        dispatch({
          type: 'ERROR_HANDLING_NAVIGATION',
          error: {
            getCategories: error.message,
          },
        })
      })
}

export const getMegaNav = () => (dispatch, getState) => {
  if (!isMobile(getState())) {
    return dispatch(get('/desktop/navigation'))
      .then(({ body }) => {
        dispatch({ type: 'SET_MEGA_NAV', megaNav: body })
        return dispatch(setNavigationEspots(body))
      })
      .catch((err) => {
        if (err.response && err.response.body) {
          err.message = err.response.body.message
          return dispatch(setGenericError(err))
        }
        return dispatch(setApiError(err))
      })
  }

  return Promise.resolve()
}

export function pushCategoryHistory(menuItem) {
  return {
    type: 'PUSH_CATEGORY_HISTORY',
    menuItem,
  }
}

export function popCategoryHistory() {
  return {
    type: 'POP_CATEGORY_HISTORY',
  }
}

export function resetCategoryHistory() {
  return {
    type: 'RESET_CATEGORY_HISTORY',
  }
}

export function setMegaNavSelectedCategory(megaNavSelectedCategory) {
  return {
    type: 'SET_MEGA_NAV_SELECTED_CATEGORY',
    megaNavSelectedCategory,
  }
}

export function setMegaNavHeight(megaNavHeight) {
  return {
    type: 'SET_MEGA_NAV_HEIGHT',
    megaNavHeight,
  }
}
