export const authenticateMySession = (jsessionId) =>
  `${jsessionId}; authenticated=yes;`
