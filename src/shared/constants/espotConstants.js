/**
 * The keys used to fetch espots from the /espots endpoint are different
 * to the keys we use in Monty (i.e. those in constants/espotsDesktop.js),
 * so we have this mapping to translate them.
 * See getPDPEspots in espotActions.js
 */
export const espotKeysMap = {
  global: {
    'CE Tactical message espot': 'global',
    'header espot': 'siteWideHeader',
    'monty header espot': 'brandHeader',
  },

  shared: {
    CONTACT_BANNER: 'CONTACT_BANNER',
  },
  search_results: {
    NO_SEARCH_RESULT_ESPOT: 'NO_SEARCH_RESULT_ESPOT',
  },
  marketing_slide_up: {
    MARKETING_SLIDE_UP_ESPOT: 'MARKETING_SLIDE_UP_ESPOT',
  },
  abandonment_modal: {
    HOME: 'ABANDONMENT_SIGNUP_MODAL_HOME',
    CATEGORY: 'ABANDONMENT_SIGNUP_MODAL_CATEGORY',
    PDP: 'ABANDONMENT_SIGNUP_MODAL_PDP',
  },
  pdp: {
    'CE Product espot - column 1 position 1': 'col1pos1',
    'CE Product espot - column 1 position 2': 'col1pos2',
    'Klarna-PDP-E-Spot-1': 'klarna1',
    'Klarna-PDP-E-Spot-2': 'klarna2',
    'CE Product espot - column 2 position 1': 'col2pos1',
    'CE Product espot - column 2 position 2': 'col2pos2',
    'CE Product espot - column 2 position 4': 'col2pos4',
    CE3_CONTENT_ESPOT_1: 'content1',
  },
  bundles: {
    'CE Product espot - column 1 position 1': 'col1pos1',
    'Klarna-PDP-E-Spot-1': 'klarna1',
    CE3_CONTENT_ESPOT_1: 'content1',
    'Klarna-PDP-E-Spot-2': 'klarna2',
  },
  thankyou: {
    CONFIRMATION_DISCOVER_MORE: 'CONFIRMATION_DISCOVER_MORE',
  },
}
