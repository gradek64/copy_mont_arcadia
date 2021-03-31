import querystring from 'querystring'
import crypto from 'crypto'

export const urlEncode = (obj) => querystring.stringify(obj)

export const pad = (num, size) => `000000000${num}`.substr(-size)

export const getSimpleDate = (date) => {
  const d = date || new Date()
  return d.getFullYear() + pad(d.getMonth() + 1, 2) + d.getDate()
}

export const encodeUserId = (userId, date = null) => {
  const data = urlEncode({ date: getSimpleDate(date), userid: userId })
  const signature = crypto
    .createHash('md5')
    .update(process.env.BV_SHAREDKEY + data)
    .digest('hex')
  const hexString = Buffer.from(data).toString('hex')
  return signature + hexString
}
