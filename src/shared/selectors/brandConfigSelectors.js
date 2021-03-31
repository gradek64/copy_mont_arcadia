const DOROTHY_PERKINS = 'dorothyperkins'
const MISSSELFRIDGE = 'missselfridge'
const BURTON = 'burton'
const WALLIS = 'wallis'
const TOPSHOP = 'topshop'

const enableSizeGuideButtonAsSizeTile = (state) =>
  state.config.brandName === DOROTHY_PERKINS
const enableDropdownForLongSizes = (state) =>
  [WALLIS, MISSSELFRIDGE].includes(state.config.brandName)
const enableQuickViewButtonOnBundlePages = (state) =>
  [TOPSHOP].includes(state.config.brandName)

// TODO temporary logic required for dual-run. To be removed as soon as all brands start using the correct slots
const shouldInvertHeaderEspotPositions = (state) =>
  ![DOROTHY_PERKINS, BURTON].includes(state.config.brandName)

export {
  enableSizeGuideButtonAsSizeTile,
  enableDropdownForLongSizes,
  shouldInvertHeaderEspotPositions,
  enableQuickViewButtonOnBundlePages,
}
