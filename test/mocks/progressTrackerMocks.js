export default {
  NEW_CUSTOMER_STEPS: [
    {
      active: false,
      title: 'Delivery',
      url: '/checkout/delivery',
    },
    {
      active: true,
      title: 'Payment',
      url: '/checkout/payment',
    },
    {
      active: false,
      title: 'Thank You',
    },
  ],
  RETURNING_CUSTOMER_STEPS: [
    {
      active: true,
      title: 'Delivery and Payment',
      url: '/checkout/delivery-payment',
    },
    {
      active: false,
      title: 'Thank You',
    },
  ],
  GUEST_CUSTOMER_STEPS: [
    {
      active: false,
      title: 'Delivery',
      url: '/guest/checkout/delivery',
    },
    {
      active: true,
      title: 'Payment',
      url: '/guest/checkout/payment',
    },
    {
      active: false,
      title: 'Thank You',
    },
  ],
}
