import * as DataMapper from '../middleware/data-mapper'

export default (product, orderLines) => {
  const basketProduct = DataMapper.product(product)

  // If the bag the user is checking out with has items prepolulated from a previous session (ScrAPI),
  // we won't have several analaytics fields such as colour, stock and rating (as with basket
  // add/remove). We can at least get colour from checkout.orderCompleted.orderLines
  const orderLine = orderLines.find(
    (orderLine) => basketProduct.lineNumber === orderLine.lineNo
  )
  if (orderLine && orderLine.colour) {
    basketProduct.colour = orderLine.colour
  }

  return basketProduct
}
