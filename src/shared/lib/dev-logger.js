/**
 * Only logs when not in production
 * this alleviates: https://github.com/nodejs/node/issues/6836
 */
export const warn = (message) => {
  if (process.env.NODE_ENV !== 'production') console.warn(message) // eslint-disable-line
}

export const error = (message) => {
  if (process.env.NODE_ENV !== 'production') console.error(message) // eslint-disable-line
}
