# Generative testing with [TestCheck.js](https://github.com/leebyron/testcheck-js)

We have introduced the use of TestCheck, a generative property-based testing library, of the use of testing functions with a high number of input combinations.

Specifically, `handleGeoIP`, takes:
- the requested domain (47 sites x 2 for mobile and desktop = 94 possible domains)
- x-user-geo header ISO (250 possible values)
- GEOIP cookie ISO (250 possible values)
- GEOIP feature flag (2 possible values)
Which means that the number of possible combinations of inputs = 11,750,000!

It's not practical to hand write that many cases but we can generate them instead!

Generative testing probably isn't suitable in all cases, e.g. testing a simple component but when the number of inputs exceeds a reasonable number it may be right to test the code using generators.

## Pitfalls

1. Don't use samples inside a generator. This will prevent the test from being reproducable with it's seed. Instead you can build generators from the results of other generators using: `then` and `suchThat`

2. Some inputs are hard to generate. This can take a lot of time but if correct, can be very beneficial.

## Conclusion

We've found testing in this way to be very fruitful, spotting a couple of bugs which we would have missed if we had used a traditional unit testing approach.

You can learn more about generative testing by reading the docs:
- https://github.com/leebyron/testcheck-js
- http://leebyron.com/testcheck-js/api
