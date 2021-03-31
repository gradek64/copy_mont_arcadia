// Common shared Schemas
import {
  stringType,
  stringTypeEmpty,
  stringTypeCanBeEmpty,
  numberType,
  booleanType,
  objectType,
  objectOrStringType,
  arrayType,
  stringOrNull,
} from '../utilis'

export const assetsSchema = {
  title: 'PDP Assets Schema',
  type: 'object',
  required: ['assetType', 'index', 'url'],
  properties: {
    assetType: stringType,
    index: numberType,
    url: stringType,
  },
}

export const itemsSchema = {
  title: 'PDP Items Schema',
  type: 'object',
  required: [
    'attrName',
    'quantity',
    'catEntryId',
    'attrValueId',
    'selected',
    'stockText',
    'attrValue',
    'size',
    'sku',
    'sizeMapping',
  ],
  properties: {
    attrName: stringType,
    quantity: numberType,
    catEntryId: numberType,
    attrValueId: numberType,
    selected: booleanType(false),
    stockText: stringType,
    attrValue: stringType,
    size: stringType,
    sku: stringType,
    sizeMapping: stringType,
  },
}

export const additionalAssetsSchema = {
  title: 'PDP On Sale Additional Assets Schema',
  type: 'object',
  required: ['assetType', 'index', 'url'],
  properties: {
    assetType: stringType,
    index: numberType,
    url: stringType,
  },
}

export const shopLookProductSchema = {
  title: 'Shop Look Product Schema in PDP',
  type: 'object',
  required: [
    'bundleId',
    'productDisplayURL',
    'bundleImagePath',
    'bundleProductPrice',
    'productid',
  ],
  properties: {
    bundleId: stringType,
    productDisplayURL: stringType,
    bundleImagePath: stringType,
    bundleProductPrice: stringType,
    productId: stringType,
  },
}
// ***** Starts productDataQuantitySchema ***** //
export const dataQuantitySchema = (min, max, expectedType) => {
  const data = {
    title: 'PDP product data quantity schema',
    type: `${expectedType}`,
    required: ['colourAttributes', 'quantities', 'inventoryPositions', 'SKUs'],
    properties: {
      colourAttributes: objectType,
      quantities: {
        type: 'array',
        minItems: min,
        maxItems: max,
        uniqueItems: false,
        items: { type: 'number' },
      },
      inventoryPositions: arrayType(1),
      SKUs: arrayType(1),
    },
  }
  return data
}

export const colourAttributesSchema = {
  title: 'PDP product data quantity colour attributes',
  type: 'object',
  required: ['attrValue', 'attrName'],
  properties: {
    attrValue: stringType,
    attrName: stringType,
  },
}

const quantityToArray = (totalQuantities) => {
  const tmpArr = []
  const propObj = {}
  let i
  for (i = 0; i < totalQuantities; i++) {
    propObj[i] = numberType
    tmpArr.push(`${i}`)
  }

  return { tmpArr, propObj }
}

export const quantitySchema = (totalQuantities) => {
  const data = {
    title: 'Quantity Schema',
    type: 'array',
    required: quantityToArray(totalQuantities).tmpArr,
    properties: quantityToArray(totalQuantities).propObj,
  }
  return data
}

export const inventoryPositionSchema = {
  title: 'Inventory position Schema in Product Data Quantity',
  type: 'object',
  required: ['catentryId'],
  properties: {
    catentryId: stringType,
    inventorys: arrayType(1),
  },
}

export const inventorySchema = {
  title: 'Inventory Schema in inventory positions',
  type: 'object',
  required: ['quantity', 'ffmcenterId', 'expressdates'],
  optional: ['cutofftime'],
  properties: {
    cutofftime: stringOrNull,
    quantity: numberType,
    ffmcenterId: numberType,
    expressdates: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      uniqueItems: true,
      items: { type: 'string' },
    },
  },
}

export const expressdateSchema = {
  title: 'Express date in inventory item',
  type: 'array',
  required: ['0', '1'],
  properties: {
    0: stringType,
    1: stringType,
  },
}

export const skuSchema = {
  title: 'SKU schema in Product Data Quantity',
  type: 'object',
  required: ['skuid', 'value', 'availableinventory', 'partnumber', 'attrName'],
  properties: {
    skuid: stringType,
    value: stringType,
    availableinventory: stringType,
    partnumber: stringType,
    attrName: stringType,
  },
}
// ***** Ends productDataQuantitySchema ***** //

// ***** Starts Espots Schema ***** //
export const espotsSchema = (pdpPageType) => {
  const data = {
    title: `Schema in ${pdpPageType}`,
    type: 'object',
    optional: [
      'CE3ContentEspot1',
      'CEProductEspotCol1Pos1',
      'CEProductEspotCol2Pos2',
      'CEProductEspotCol2Pos4',
    ],
    properties: {
      CE3ContentEspot1: objectOrStringType,
      CEProductEspotCol1Pos1: objectOrStringType,
      CEProductEspotCol2Pos2: objectOrStringType,
      CEProductEspotCol2Pos4: objectOrStringType,
    },
  }
  return data
}

export const CEProductEspotContentsSchema = (espotPos, pdpPageType) => {
  const data = {
    title: `Espotcontents Schema in  ${espotPos} for ${pdpPageType}`,
    type: 'object',
    required: ['encodedcmsMobileContent'],
    properties: {
      encodedcmsMobileContent: stringType,
    },
  }
  return data
}

export const CEProductEspotContentsSchemaWithCmsMobileContent = (
  espotPos,
  pdpPageType
) => {
  const data = {
    title: `Espotcontents Schema in  ${espotPos} for ${pdpPageType}`,
    type: 'object',
    required: ['cmsMobileContent', 'encodedcmsMobileContent'],
    properties: {
      cmsMobileContent: objectType,
      encodedcmsMobileContent: stringType,
    },
  }
  return data
}

export const cmsMobileContentSchema = () => {
  const data = {
    title:
      'Espotcontents Schema in  CEProductEspotCol2Pos2 => cmsMobileContent for PDP Simple',
    type: 'object',
    required: [
      'pageId',
      'pageName',
      'breadcrumb',
      'baseline',
      'revision',
      'lastPublished',
      'contentPath',
      'seoUrl',
      'mobileCMSUrl',
    ],
    optional: ['responsiveCMSUrl'],
    properties: {
      pageId: numberType,
      pageName: stringType,
      breadcrumb: stringTypeCanBeEmpty,
      baseline: stringType,
      revision: stringType,
      lastPublished: stringType,
      contentPath: stringType,
      seoUrl: stringTypeEmpty,
      mobileCMSUrl: stringTypeEmpty,
      responsiveCMSUrl: stringTypeCanBeEmpty,
    },
  }
  return data
}

export const KlarnaPDPEspot2Schema = {
  title: 'KlarnaPDPEspot2 Schema',
  type: 'object',
  required: ['contentText'],
  properties: {
    contentText: stringType,
  },
}

export const CE3ContentEspot1Schema = {
  title: 'CE3ContentEspot1 Schema',
  type: 'object',
  required: ['contentText'],
  properties: {
    contentText: stringType,
  },
}
export const CEProductEspotSchemaWithOnlyContentText = (espotPos) => {
  const data = {
    title: ` ${espotPos} Schema`,
    type: 'object',
    required: ['contentText'],
    properties: {
      contentText: stringType,
    },
  }
  return data
}

export const CEProductEspotSchemaForEspotContents = () => {
  const data = {
    title: 'CEProductEspotWithEspotContents Schema',
    type: 'object',
    required: ['EspotContents'],
    properties: {
      EspotContents: objectType,
    },
  }
  return data
}
// ***** Ends Espots Schema ***** //
