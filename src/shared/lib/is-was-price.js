// this is a hack to compensate for the fact that sometimes a product has an incorrect was price
// this is a issue with the data coming from the scape api

const isWasPrice = (wasPrice, price) => {
  return wasPrice && parseFloat(price) < parseFloat(wasPrice)
    ? wasPrice
    : undefined
}
export default isWasPrice
