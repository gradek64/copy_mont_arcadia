export function toggleAccordion(key, groupName = '') {
  return {
    type: 'TOGGLE_ACCORDION',
    key,
    groupName,
  }
}

export function openAccordion(key, groupName = '') {
  return {
    type: 'OPEN_ACCORDION',
    key,
    groupName,
  }
}

export function setInitiallyExpandedAccordion(key) {
  return {
    type: 'SET_INITIALLY_EXPANDED_ACCORDION',
    key,
  }
}

export function closeAllAccordions() {
  return {
    type: 'CLOSE_ALL_ACCORDIONS',
  }
}

export function closeAccordion(key) {
  return {
    type: 'CLOSE_ACCORDION',
    key,
  }
}

export function setScrolledIntoView(key, value) {
  return {
    type: 'SET_SCROLLED_INTO_VIEW',
    key,
    value,
  }
}

export function closeOtherAccordionsInGroup(groupName, accordionName) {
  return {
    type: 'CLOSE_OTHER_ACCORDIONS_IN_GROUP',
    groupName,
    accordionName,
  }
}
