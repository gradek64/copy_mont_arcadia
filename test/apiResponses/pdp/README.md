# URLs mapping

| monty hapi                 | scrAPI               | WCS                                      |
|:---------------------------|:---------------------|:-----------------------------------------|
| /api/products/{identifier} | /product/{productId} | webapp/wcs/stores/servlet/ProductDisplay |

# wcs_mod_for_tests.json

This json contains a modified version of the WCS response that can ease our unit testing to check our mapping logic.
Since the WCS instance used to get the response is the sandpit one, we modified the URLs in the response to be comparable during unit testing. Hence `http://ts.sandpit.arcadiagroup.ltd.uk` has been modified to become `http://media.topshop.com`. We have been obliged to do this because we don't have a scrAPI instance accessible through sandpit and we don't have a WCS instance accessible from stage.

# /swatches folder

We collect in the /swatches folder the responses for a product which includes swatches data.

# Modified responses

## test/apiResponses/pdp/bundles/flexible/wcs_flexible_bundle.json
Added for all the products of the Bundle `was1Price` and `was2Price` in order to be able to fill the hapi response `wasPrice` and `wasWasPrice`.
