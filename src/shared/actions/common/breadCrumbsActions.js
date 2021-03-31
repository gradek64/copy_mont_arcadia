export function hideBreadCrumbs(isHidden = true) {
  return {
    type: 'HIDE_BREADCRUMBS',
    payload: isHidden,
  }
}
