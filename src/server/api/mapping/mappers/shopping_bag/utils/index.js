import { pathOr, pick } from 'ramda'

const extractParametersFromProduct = (
  {
    addToBagForm: { attrValue = '', attrName = '', productItemValue = [] } = {},
    productData: { items = [] } = {},
  } = {},
  sku
) => {
  const skuid = (items.find((item) => item.sku === sku) || '').skuid
  const size = productItemValue.find((item) => item.catEntryId === skuid) || {}
  return {
    attrValue: [attrValue, size.attrValue || ''],
    attrName: [attrName, size.attrName || ''],
  }
}

const extractBundleProductParameters = (
  product = {},
  slotNumber = '0',
  sku
) => {
  const { attrValue, attrName, slot, quantity, catEntryId } = [
    'attrValue',
    'attrName',
    'slot',
    'quantity',
    'catEntryId',
  ].reduce(
    (properties, property) => ({
      ...properties,
      [property]: `${property}_${slotNumber}`,
    }),
    {}
  )

  const colour = pathOr({}, ['attributes', 0], product)
  const sizeValue = (pathOr([], ['items'], product).find(
    (item) => item.partNumber.toString() === sku
  ) || '')[attrValue]

  return {
    [slot]: slotNumber,
    [quantity]: 1,
    [catEntryId]: '',
    [attrValue]: [colour[attrValue] || '', sizeValue || ''],
    [attrName]: [colour[attrName] || '', product[attrName] || ''],
    ...pick([slot, catEntryId, quantity], product),
  }
}

const extractParametersFromBundle = (
  { BundleDetails: { bundleDetailsForm: { bundleSlots = [] } = {} } = {} } = {},
  bundleItems
) => {
  const pdpToAdd = bundleSlots.map((slot, index) =>
    slot.product.find(
      (item) => bundleItems[index].productId === item[`catEntryId_${index + 1}`]
    )
  )
  return pdpToAdd.reduce(
    (parameters, product, index) => ({
      ...parameters,
      ...extractBundleProductParameters(
        product,
        index + 1,
        bundleItems[index].sku
      ),
    }),
    {}
  )
}

export {
  extractParametersFromProduct,
  extractBundleProductParameters,
  extractParametersFromBundle,
}
