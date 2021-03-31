export const calculatePayloadSize = (payload) => {
  const str = JSON.stringify(payload)
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  const m = encodeURIComponent(str).match(/%[89ABab]/g)
  return (str ? str.length : 0) + (m ? m.length : 0)
}

/**
 * Takes a boolean and stringify's value for consumption by
 * google analytics
 * @param {boolan} bool
 * @returns {string} 'True' Or 'False'
 */
export const boolToString = (bool) => (bool ? 'True' : 'False')
