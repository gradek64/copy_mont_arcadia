export function getDressipiBrand(brandCode, region) {
  const code = brandCode + region
  let brand
  let location = ''

  if (code === 'tsuk') {
    brand = 'topshop.com'
  } else if (code === 'tsus') {
    location = '-us'
    brand = 'topshop.com'
  } else if (code === 'wluk') {
    brand = 'wallis.co.uk'
  } else if (code === 'evuk') {
    brand = 'evans.co.uk'
  }

  return { location, brand }
}
