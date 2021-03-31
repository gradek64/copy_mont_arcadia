# Scenario 1

## Response samples

/Users/tolazzi/Projects/full-monty/test/apiResponses/order-summary/update-order/select-parcelshop/registered/fullProfile/hapiMonty_home-to-parcel.json

/Users/tolazzi/Projects/full-monty/test/apiResponses/order-summary/update-order/select-parcelshop/registered/fullProfile/wcs_home-to-parcel.json

## Steps

1. Register new User
2. Complete checkout where delivery method is Home Standard and the billing address is the same as delivery address.
3. Add to bag
4. Proceed to checkout (you will be redirected to the final step of checkout)
5. Click on change delivery
6. Select Parcelshop and select a Parcelshop store.

The monty hapi response for the update delivery to Parcelshop will contain the section `billingDetails` with the data associated with the delivery address for the previous checkout and the section `deliveryDetails` with the data associated with the Parcelshop selected.


# Scenario 2


/Users/tolazzi/Projects/full-monty/test/apiResponses/order-summary/update-order/select-parcelshop/registered/fullProfile/hapiMonty_parcel1-to-parcel2.json

/Users/tolazzi/Projects/full-monty/test/apiResponses/order-summary/update-order/select-parcelshop/registered/fullProfile/wcs_parcel1-to-parcel2.json

## Steps

1. Register new User
2. Complete checkout where delivery method is Parcelshop.
3. Add to bag
4. Proceed to checkout
5. Select a different Parcelshop

The monty hapi response for the update delivery to Parcelshop will contain the section `billingDetails` with the data associated with the delivery address for the previous checkout and the section `deliveryDetails` with the data associated with the Parcelshop selected.