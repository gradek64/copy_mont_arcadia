// :: (float, int?) -> float
export const round = (value, decimals = 2) =>
  // eslint-disable-next-line
  Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
