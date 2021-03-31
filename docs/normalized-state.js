// This is an example state that we want to progress towards - but not stop at as there are still further areas to consolidate
// The idea being that we don't just accept the response from scrapi as is
// We map it either in the node middleware or in the actions/reducers to produce the state we need.

// DJB: This should be done with https://github.com/paularmstrong/normalizr as a redux middleware, rather than on
//      Node or in actions/reducers

// These will be received through a combination of delivery methods in bag calls, and order-summary calls.
const deliveryMethods = {
  HOME: {
    label: 'Home delivery',
    types: {
      HOME_STANDARD: {
        label: 'Standard Delivery',
        additionalDescription: '2 - 4 Working days',
        basketDescription: 'Standard Delivery £4.00',
        shipCode: 'S', // Only available after selection - for all methods
        cost: '4.00', // Only available after selection - for all methods
        shipModeId: 26504, // presence of this and no delivery options means no further choices
        estimatedDeliveryDate: 'Tuesday 20 October 2019',
      },
      HOME_EXPRESS: {
        label: 'Express / Nominated day delivery',
        additionalDescription: '',
        basketDescription: 'Express / Nominated day delivery £6.00',
        shipCode: 'N3',
        cost: '6.00', // I wouldn't trust this as the others are more granular maybe use it as 'from £6.00' ?
        deliveryOptions: {
          28003: { dayText: 'Tue', dateText: '11 Oct', nominatedDate: '2016-10-11', price: '6.00' },
          28004: { dayText: 'Wed', dateText: '12 Oct', nominatedDate: '2016-10-12', price: '6.00' },
          28005: { dayText: 'Thu', dateText: '13 Oct', nominatedDate: '2016-10-13', price: '6.00' },
          28006: { dayText: 'Fri', dateText: '14 Oct', nominatedDate: '2016-10-14', price: '6.00' },
          28007: { dayText: 'Sat', dateText: '15 Oct', nominatedDate: '2016-10-15', price: '6.00' },
          28002: { dayText: 'Mon', dateText: '17 Oct', nominatedDate: '2016-10-17', price: '6.00' }
        }
      }
    }
  },
  STORE: {
    label: 'Collect from store (UK only)',
    types: { // Note: only available after selection and providing store details
      STORE_STANDARD: {
        label: 'Collect From Store Standard',
        additionalDescription: 'Collection date Friday 14 October 2016',
        basketDescription: 'Collect From Store Standard £3.00',
        shipCode: 'Retail Store Standard',
        cost: '3.00',
        shipModeId: 45019
      },
      STORE_EXPRESS: {
        label: 'Collect From Store Express',
        additionalDescription: 'Collection date Tuesday 11 October 2016', // Annoying that the date text is here, not in the options - might need to fudge
        basketDescription: 'Collect From Store express £3.00',
        shipCode: 'Retail Store Express',
        cost: '3.00',
        shipModeId: 45020
      }
    }
  }
}

// These will be returned by the server during account calls and order summary calls
// Or can be added by the user through forms
const addresses = {
  address1: {
    addressLine1: '46 Sidney Road',
    addressLine2: null,
    addressLine3: null,
    country: 'United Kingdom',
    county: null,
    postcode: 'SW9 0TS',
    state: null,
    townCity: 'LONDON'
  },
  address2: {
    addressLine1: '47 Sidney Road',
    addressLine2: null,
    addressLine3: null,
    country: 'United Kingdom',
    county: null,
    postcode: 'SW9 0TS',
    state: null,
    townCity: 'LONDON'
  }
}

// Received when polling store-locator and can be used for delivery
const storeAddresses = {
  TS0032: {
    name: 'Strand',
    distance: '0.16',
    latitude: 51.509599,
    longitude: -0.123069,
    address: {
      line1: '60/64 The Strand',
      line2: '',
      city: 'Greater London',
      postcode: 'WC2N 5LR'
    },
    openingHours: {
      monday: '09:00-20:00',
      tuesday: '09:00-20:00',
      wednesday: '09:00-20:00',
      thursday: '09:00-20:00',
      friday: '09:00-20:00',
      saturday: '09:00-20:00',
      sunday: '12:00-18:00'
    },
    telephoneNumber: '020 7839 4144'
  }
}

// Received through products fetching on PLP
// Can be reconciled and combined with data from product data from PDP
// Currently the responses are different structures - this should be alleviated in the node layer
// And allow a single store. Not required yet as PDP works fine in isolation - will be for future plans.
const products = {
  26388230: {
    lineNumber: '32X17KPEW',
    name: 'GOLA Coaster Hitop Trainers',
    lowStock: false,
    inStock: true,
    wasPrice: '',
    unitPrice: '50.00',
    totalPrice: '50.00',
    assets: {},
    items: {
      602016001018610: {
        size: '8',
        quantity: 10
      }
    },
    attributes: {},
    colourSwatches: {},
    bundleSlots: {},
    isBundleOrOutfit: false
  }
}

// PLP then becomes an array of refrences to products - the other data will remain unchanged.
const plp = {
  products: [26388230],
  otherPlpData: {}
}

// Obtained from site-options currently - but moving towards a Payments Method handler to allow APMs and klarna to be centralised
const paymentMethods = {
  VISA: {
    label: 'Visa',
    // Validation not required at stage one, but would be nice to centralise.
    validation: { // In future could be used to generate the form dynamically allowing faster adding of payment methods.
      cardNumber: {
        length: 16,
        message: 'A 16 digit card number is required'
      },
      cvv: {
        length: 3,
        message: 'A 3 digit CVV is required'
      },
      expiryDate: 'MM/YY',
      startDate: null
    }
  },
  MCARD: {
    label: 'Mastercard',
    validation: {
      cardNumber: {
        length: 16,
        message: 'A 16 digit card number is required'
      },
      cvv: {
        length: 3,
        message: 'A 3 digit CVV is required'
      },
      expiryDate: 'MM/YY',
      startDate: null
    }
  }
}

// Payment details - either provided by the server in account / order-summary
// or entered through a form - that will decide what data is available here.
// Complexity around storage of CVV and wiping on changing data. To be discussed when reached, but clearer UX would help.
const paymentDetails = {
  payment1: {
    type: 'VISA',
    cardNumber: 1234123123123123,
    cvv: 123,
    cardNumberHash: 'tjOBl4zzS+toHslPB+u0Z0x24+iMu0Qb',
    cardNumberStar: '************1152',
    expiryMonth: '08',
    expiryYear: '2016'
  }
}

// TODO - dont have a gift card to investigate data available / required
const giftCards = {
  6331456642825039: {
    value: 50,
    pin: '0133'
  }
}

// Added by the user either in the bag or in checkout.
// Maintained even if not applied, allowing UI improvements in future.
const promotions = {
  TSCARD1: {
    label: 'Topshop Card- £5 Welcome offer on a £50+ spend'
  }
}

// could key by order ID to allow multiple baskets and orders, not needed yet so leaving to reduce complexity
const basket = {
  // Key is 'orderItemId'
  products: {
    6535951: {
      // Cant see sku here meaning we have to duplicate inStock as no way to ref via products
      // Means it's possible to be out of sync between PDP and bag.
      productId: 26388230,
      quantity: 1,
      size: '8',
      inStock: true
    }
  },
  promotions: ['TSCARD1'],
  discounts: [{
    label: 'Topshop Card- £5 Welcome offer on a £50+ spend',
    value: '5.00'
  }],
  subTotal: '78.00',
  total: '73.00',
  totalBeforeDiscount: '78.00'
}

// Could key by ID to allow multiple orders - no need yet but could
// combine with order history response - but they are not identical
// Will leave for future changes for now.
const order = {
  orderId: 1232131231,

  deliveryLocation: 'HOME',
  deliveryType: 'HOME_EXPRESS',
  deliveryOption: 28003,

  deliveryAddress: 'address1 | TS0032', // Can be either - based on deliveryLocation tells you which reducer to fetch from
  billingAddress: 'address2',

  paymentDetails: 'payment1',
  giftCards: [{
    id: 6331456642825039,
    value: 10 // TODO - not sure if we offer this feature yet - if not, just array of ids needed.
  }]
}

// Final state
export default {
  deliveryMethods,
  addresses,
  storeAddresses,
  plp,
  products,
  paymentMethods,
  paymentDetails,
  giftCards,
  promotions,
  basket,
  order
}