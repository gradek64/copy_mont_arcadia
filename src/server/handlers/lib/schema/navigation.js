export default {
  type: 'object',
  strict: true,
  properties: {
    navigationEntries: {
      type: 'array',
      items: {
        type: 'object',
        strict: true,
        properties: {
          navigationEntryType: { type: 'string' },
          index: { type: 'integer' },
          label: { type: 'string' },
          categoryId: { type: 'integer' },
          categoryFilter: { type: 'string' },
          seoUrl: { type: 'string' },
          redirectionUrl: { type: 'string', optional: true },
          navigationEntries: {
            type: 'array',
            items: {
              type: 'object',
              strict: true,
              properties: {
                navigationEntryType: { type: 'string' },
                index: { type: 'integer' },
                label: { type: 'string' },
                categoryId: { type: 'integer' },
                categoryFilter: { type: 'string' },
                seoUrl: { type: 'string' },
                redirectionUrl: { type: 'string', optional: true },
                navigationEntries: { type: 'array' },
              },
            },
          },
        },
      },
    },
    updateTimestamp: { type: 'integer' },
    version: { type: 'string' },
  },
}
