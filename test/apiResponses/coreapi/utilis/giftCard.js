import superagent from 'superagent'
import eps from '../routes_tests'
import { headers } from '../utilis'

export const addGiftCard = async (jsessionId, giftCardNumber) => {
  const giftCardResponse = await superagent
    .post(eps.checkout.addGiftCard.path)
    .set(headers)
    .set({ Cookie: jsessionId })
    .send(giftCardNumber)
  return giftCardResponse.body
}

export const addGiftCardResponse = async (cookies = '', giftCardNumber) => {
  const giftCardResponse = await superagent
    .post(eps.checkout.addGiftCard.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(giftCardNumber)
  return giftCardResponse
}

export const removeGiftCard = async (jsessionId, cardId) => {
  const giftCardResponse = await superagent
    .delete(eps.checkout.deleteGiftCard.path)
    .set(headers)
    .query(`giftCardId=${cardId}`)
    .set({ Cookie: jsessionId })
  return giftCardResponse.body
}

export const removeGiftCardResponse = async (cookies = '', cardId) => {
  const giftCardResponse = await superagent
    .delete(eps.checkout.deleteGiftCard.path)
    .set(headers)
    .query(`giftCardId=${cardId}`)
    .set({ Cookie: cookies })
  return giftCardResponse
}
