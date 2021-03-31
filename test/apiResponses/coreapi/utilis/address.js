require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import { headers } from '../utilis'
import eps from '../routes_tests'
import randomstring from 'randomstring'

const address = () => {
  const postCodeList = [
    'NW1 5QD',
    'IP3 0BL',
    'W1T 3NL',
    'EC3N 1HP',
    'W6 8BT',
    'SW6 7ST',
  ]
  const postCode = postCodeList[Math.floor(postCodeList.length * Math.random())]
  const cityList = [
    'London',
    'Manchester',
    'Norwich',
    'Ipswich',
    'York',
    'Brighton',
  ]
  const city = cityList[Math.floor(postCodeList.length * Math.random())]
  return {
    country: 'United Kingdom',
    postcode: postCode,
    address1: randomstring
      .generate({
        length: 6,
        charset: `alphabetic`,
      })
      .toLowerCase(),
    address2: randomstring
      .generate({
        length: 6,
        charset: `alphabetic`,
      })
      .toLowerCase(),
    city,
    state: '',
  }
}

const findAddress = async (country = 'GBR', postcode = 'NW15QD') => {
  return superagent
    .get(eps.address.path)
    .query(`country=${country}&postcode=${postcode}&address=`)
    .set(headers)
}

const findAddressMoniker = async (currentMonikerCode) => {
  return superagent
    .get(eps.addressMoniker.path(currentMonikerCode))
    .query(`country=GBR`)
    .set(headers)
}

export default {
  address,
  findAddress,
  findAddressMoniker,
}
