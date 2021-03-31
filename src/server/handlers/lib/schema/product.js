const productSchema = {
  type: 'object',
  properties: {
    description: {
      type: 'string',
      $sanitizedDecodedHTML: true,
    },
  },
}

export const productBySeoSchema = {
  type: 'object',
  properties: {
    products: {
      type: 'array',
      items: productSchema,
    },
  },
}

export const productByIdSchema = productSchema
