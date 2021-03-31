export function setSessionJwt(sessionJwt) {
  return {
    type: 'SET_SESSION_JWT',
    sessionJwt,
  }
}

export function setJsessionid(jsessionid) {
  return {
    type: 'SET_JSESSION_ID',
    jsessionid,
  }
}
