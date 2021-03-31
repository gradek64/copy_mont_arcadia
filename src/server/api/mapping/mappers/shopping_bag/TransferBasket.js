import Mapper from '../../Mapper'

export default class TransferBasket extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/BasketTransferCmd'
    this.method = 'post'
  }
  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { transferStoreID, transferOrderID } = this.payload
    this.payload = {
      transferStoreID,
      transferOrderID,
      langId,
      storeId,
      catalogId,
    }
    this.query = {}
  }
}

export const transferBasketSpec = {
  summary: 'Transfers a basket to the current basket',
  parameters: [
    {
      name: 'transferStoreID',
      in: 'payload',
      type: 'string',
      required: true,
    },
    {
      name: 'transferOrderID',
      in: 'payload',
      type: 'string',
      required: true,
    },
  ],
}
