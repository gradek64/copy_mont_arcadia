import { productByIdSchema, productBySeoSchema } from './product'
import cmsSchema, { cmsTermsAndConditionsSchema } from './cms'
import siteOptionsSchema from './site-options'
import navigationSchema from './navigation'

export default {
  GET: {
    '/.+/site-options$': siteOptionsSchema,
    '/.{4}/navigation$': navigationSchema,

    '/.{4}/cms/page/name/termsAndConditions$': cmsTermsAndConditionsSchema,
    '/.{4}/cms/page/url$': cmsSchema,
    '/.{4}/cms/page/name/.+$': cmsSchema,

    '/.{4}/product/seo.+$': productBySeoSchema,
    '/.{4}/product/.+$': productByIdSchema,
  },
}
