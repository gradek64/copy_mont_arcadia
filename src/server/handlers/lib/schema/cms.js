import inspector from 'schema-inspector'

function validate(schema, post) {
  if (this instanceof inspector.Sanitization) {
    inspector.sanitize(schema, post)
  } else if (this instanceof inspector.Validation) {
    const validated = inspector.validate(schema, post)
    if (!validated.valid) {
      this.report(validated.format())
    }
  }
}

const cmsSchema = {
  imagelist: {
    options: {
      type: 'object',
      optional: true,
      properties: {
        className: { type: 'string', optional: true },
        margin: { type: 'string', optional: true },
      },
    },
    assets: {
      type: 'array',
      items: {
        type: 'object',
        strict: true,
        properties: {
          alt: { type: 'string' },
          link: { type: 'string', optional: true },
          source: { type: 'string', minLength: 1 },
          target: { type: 'string' },
        },
      },
    },
  },
  carousel: {
    options: {
      type: 'object',
      optional: true,
      properties: {
        arrow: { type: 'string', optional: true },
        autoplay: { type: 'string', optional: true },
        dots: { type: 'string', optional: true },
        height: { type: 'string', optional: true },
        margin: { type: 'string', optional: true },
        width: { type: 'string', optional: true },
      },
    },
    assets: {
      type: 'array',
      items: {
        type: 'object',
        strict: true,
        properties: {
          alt: { type: 'string' },
          link: { type: 'string' },
          source: { type: 'string', minLength: 1 },
          target: { type: 'string' },
        },
      },
    },
  },
  video: {
    caption: { type: 'string', optional: true },
    height: { type: 'string', optional: true },
    margin: { type: 'string', optional: true },
    poster: { type: 'string', optional: true },
    ratio: { type: 'string', optional: true },
    source: { type: 'string' },
    width: { type: 'string', optional: true },
    youtube: { type: 'string', optional: true },
  },
  iframe: {
    alt: { type: 'string', optional: true },
    autoresize: { type: 'string', optional: true },
    link: { type: 'string', optional: true },
    margin: { type: 'string', optional: true },
    source: { type: 'string', minLength: 1 },
    target: { type: 'string', optional: true },
    height: { type: 'number', optional: true },
  },
  html: {
    margin: { type: 'string', optional: true },
    className: { type: 'string', optional: true },
    markup: { type: 'string', optional: true },
  },
  custom: {
    template: { type: 'string' },
    markup: { type: 'string' },
  },
}

const tcsSchema = {
  type: 'object',
  strict: true,
  properties: {
    pageHeading: { type: 'string' },
    '1stlevel': {
      type: 'array',
      items: {
        type: 'object',
        strict: true,
        properties: {
          heading: { type: 'string' },
          '2ndlevel': {
            type: 'array',
            items: {
              type: 'object',
              strict: true,
              properties: {
                subHeading: { type: 'string' },
                markup: { type: 'string', $sanitizedHTML: true },
              },
            },
          },
        },
      },
    },
  },
}

export default {
  type: 'object',
  strict: true,
  properties: {
    pageId: { type: 'number' },
    pageName: { type: 'string' },
    baseline: { type: 'string' },
    contentPath: { type: 'string' },
    seoUrl: { type: 'string' },
    settings: { type: 'object', optional: true },
    pageData: {
      type: ['object', 'array'],
      optional: true,
      exec(_schema, posts) {
        if (!Array.isArray(posts)) {
          //
          // Ts&Cs like content
          //
          validate.call(this, tcsSchema, posts)
        } else {
          //
          // "standard" CMS page
          //

          posts = posts
            .filter((post) => {
              // Accepting null or undefined pending CMS fix, see https://montyprod.api.arcadiagroup.co.uk/api/dpuk/cms/page/name/error404
              return !!post
            })
            .map((currentPost) => {
              if (currentPost.formCss || currentPost.type === '') {
                // Temporarily allow CMS form content through
                return currentPost
              }
              if (!cmsSchema[currentPost.type]) {
                this.report(
                  `Received invalid pageData type for CMS content: ${
                    currentPost.type
                  }`
                )
                return 'INVALID'
              }
              validate.call(
                this,
                {
                  type: 'object',
                  strict: true,
                  properties: {
                    type: {
                      type: 'string',
                      pattern: /imagelist|carousel|video|iframe|html|custom/,
                    },
                    data: {
                      type: 'object',
                      strict: true,
                      properties: {
                        columns: { type: 'number' },
                        ...cmsSchema[currentPost.type],
                      },
                    },
                  },
                },
                currentPost
              )
              return currentPost
            })
        }
        return posts
      },
    },
    version: { type: 'string' },
  },
}

export const cmsTermsAndConditionsSchema = {
  type: 'object',
  strict: true,
  properties: {
    pageId: { type: 'integer' },
    pageName: { type: 'string' },
    baseline: { type: 'string' },
    contentPath: { type: 'string' },
    seoUrl: { type: 'string' },
    pageData: {
      type: 'object',
      strict: true,
      properties: {
        pageHeading: { type: 'string' },
        '1stlevel': {
          type: 'array',
          items: {
            type: 'object',
            strict: true,
            properties: {
              heading: { type: 'string' },
              '2ndlevel': {
                type: 'array',
                items: {
                  type: 'object',
                  strict: true,
                  properties: {
                    subHeading: { type: 'string' },
                    markup: { type: 'string', $sanitizedHTML: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    version: { type: 'string' },
  },
}
