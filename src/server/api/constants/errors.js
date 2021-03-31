const sessionTimeoutError = {
  errorStatusCode: 440, // IIS extension to 4xx error space
  error: 'Login Time-out',
  message: 'Must be logged in to perform this action',
  originalMessage: 'Must be logged in to perform this action',
}

export { sessionTimeoutError }
