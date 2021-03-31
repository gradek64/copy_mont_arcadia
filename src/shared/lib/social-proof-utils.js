import { createStorageWrapper } from '../../client/lib/storageWrapperFactory'

export const exceedsMaxSocialProofViewCount = (
  view,
  maximumPDPMessageViewsPerSession
) => {
  const viewCounter = createStorageWrapper('sessionStorage').getItem(
    'social_proof_view_count'
  )
  const currentViews = (!!viewCounter && viewCounter[view]) || 0

  return (
    !!maximumPDPMessageViewsPerSession &&
    maximumPDPMessageViewsPerSession <= currentViews
  )
}

export const incrementSocialProofViewCounter = (view) => {
  const sessionStorage = createStorageWrapper('sessionStorage')
  const viewCounter = sessionStorage.getItem('social_proof_view_count') || {}

  sessionStorage.setItem('social_proof_view_count', {
    ...viewCounter,
    [view]: viewCounter[view] ? viewCounter[view] + 1 : 1,
  })
}
