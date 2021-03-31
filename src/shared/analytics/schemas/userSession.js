const userSessionSchema = {
  type: 'object',
  properties: {
    user: {
      oneOf: [
        {
          type: 'object',
          properties: {
            loggedIn: {
              type: 'string',
              enum: ['True'],
            },
            id: { type: 'string' },
            dualRun: {
              type: 'string',
            },
          },
          required: ['loggedIn', 'id', 'dualRun'],
        },
        {
          type: 'object',
          properties: {
            loggedIn: {
              type: 'string',
              enum: ['False'],
            },
            dualRun: {
              type: 'string',
            },
          },
          required: ['loggedIn', 'dualRun'],
        },
      ],
    },
  },
  required: ['user'],
}

export default userSessionSchema
