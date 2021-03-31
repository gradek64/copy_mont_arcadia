const NEW_CUSTOMER_STEPS = [
  {
    title: 'Delivery',
    url: '/checkout/delivery',
  },
  {
    title: 'Payment',
    url: '/checkout/payment',
  },
  {
    title: 'Thank You',
  },
]

const RETURNING_CUSTOMER_STEPS = [
  {
    title: 'Delivery and Payment',
    url: '/checkout/delivery-payment',
  },
  {
    title: 'Thank You',
  },
]

const GUEST_CUSTOMER_STEPS = [
  {
    title: 'Delivery',
    url: '/guest/checkout/delivery',
  },
  {
    title: 'Payment',
    url: '/guest/checkout/payment',
  },
  {
    title: 'Thank You',
  },
]

export { NEW_CUSTOMER_STEPS, RETURNING_CUSTOMER_STEPS, GUEST_CUSTOMER_STEPS }
