import { isEmpty, path } from 'ramda'
// custom value not understood by browsers introduced to block css loading
const deferredLoadMediaValue = 'defer-load'
// stores the real media attribute value until deferred css can be loaded
const mediaDataAttributeName = 'data-breakpoint'

/**
 * Moves media attribute value to 'data-breakpoint' and sets media to 'defer-load'
 * @param styles
 * @returns {*}
 */
export const deferStyles = (styles) => {
  if (isEmpty(styles) || typeof styles === 'undefined') return styles

  return styles.map((style) => {
    if (style.rel !== 'stylesheet') return style

    return {
      ...style,
      media: deferredLoadMediaValue,
      [mediaDataAttributeName]: style.media ? style.media : 'all',
    }
  })
}

const activateStyle = (link) => {
  if (link[mediaDataAttributeName] && link.media === deferredLoadMediaValue) {
    link.media = link[mediaDataAttributeName]
  }
  return link
}

/**
 * Utility function responsible for activating deferred css objects
 * Moves value from 'data-breakpoint' property to 'media'
 * @param state
 */
export const activateDeferredStyles = (links) => {
  if (!links) return []

  return links.map(activateStyle)
}

/**
 * Helmet callback function run onChangeClientState
 * Responsible for activating deferred css objects
 * @param state
 */
export const activateDeferredStylesCallback = (state) => {
  const links = path(['linkTags'], state)

  if (!links) return state

  const linkTags = links.map(activateStyle)

  return { ...state, linkTags }
}
