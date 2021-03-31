import * as topshop from './topshop_footer_config'
import * as topman from './topman_footer_config'
import * as burton from './burton_footer_config'
import * as evans from './evans_footer_config'
import * as dorothyperkins from './dorothyperkins_footer_config'
import * as missselfridge from './missselfridge_footer_config'
import * as wallis from './wallis_footer_config'

const brands = {
  topshop,
  topman,
  burton,
  evans,
  dorothyperkins,
  missselfridge,
  wallis,
}

const defaultObject = {
  newsletter: {},
  socialLinks: {},
  bottomContent: {},
}

// pass in brandName and region and get a footer config
export const getFooterConfig = (brandName, region) => {
  if (!brands[brandName]) return defaultObject
  if (!brands[brandName][region]) return defaultObject
  return brands[brandName][region] || brands[brandName].defaultConfig
}
