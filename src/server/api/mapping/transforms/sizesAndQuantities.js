const sizeFragment = ({
  size = '',
  quantity = 0,
  price = 0,
  catEntryId = '',
  selected = false,
  wasPrice = null,
  wasWasPrice = null,
}) => ({
  size,
  quantity,
  catEntryId: Number(catEntryId),
  selected,
  wasPrice: wasPrice || '',
  wasWasPrice: wasWasPrice || '',
  unitPrice: price.toFixed(2),
})

const sizesAndQuantitiesTransform = ({ options = [] }) => {
  return {
    items: Array.isArray(options) ? options.map(sizeFragment) : [],
    version: '1.7',
  }
}

export { sizeFragment }

export default sizesAndQuantitiesTransform
