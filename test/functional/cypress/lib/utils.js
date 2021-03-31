export const changeToNumber = (price) =>
  Number(price.replace('Now ', '').replace('£', ''))
