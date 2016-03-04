module.exports = {
  title: 'meta',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    },
    created: {
      type: 'string',
      format: 'datetime'
    },
    modified: {
      type: 'string',
      format: 'datetime'
    },
    responses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          image: {
            type: 'string'
          },
          website: {
            type: 'string'
          },
          text: {
            type: 'string'
          },
          published: {
            type: 'string',
            format: 'datetime'
          }
        },
        required: [
          'name',
          'text',
          'published'
        ]
      }
    },
    likes: {
      type: 'integer'
    },
    authorEmail: {
      type: 'string',
      format: 'email'
    }
  },
  required: [
    'id',
    'responses',
    'likes'
  ]
};
