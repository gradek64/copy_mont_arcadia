export const setFinalisedOrder = (finalisedOrder) => {
  return {
    type: 'SET_FINALISED_ORDER',
    finalisedOrder,
  }
}

export const clearFinalisedOrder = () => {
  return {
    type: 'CLEAR_FINALISED_ORDER',
  }
}
