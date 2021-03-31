export function setRecommendations(res) {
  return {
    type: 'SET_RECOMMENDATIONS',
    recommendations: res && res.length && res[0] && res[0].recs,
  }
}

export function forwardRecommendations() {
  return {
    type: 'FORWARD_RECOMMENDATIONS',
  }
}

export function backRecommendations() {
  return {
    type: 'BACK_RECOMMENDATIONS',
  }
}

export function clickRecommendation(id) {
  return {
    type: 'CLICK_RECOMMENDATION',
    id,
  }
}
