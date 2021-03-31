const pageSchema = {
  type: 'object',
  properties: {
    pageType: {
      type: 'string',
    },
    pageCategory: {
      type: 'string',
    },
  },
  required: ['pageType', 'pageCategory'],
}

export default pageSchema
