/* eslint-disable */
/**
 * Feel free to explore, or check out the full documentation
 * https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/scripting-monitors/writing-scripted-browsers
 * for details.
 */

const emailAddress = 'bob.bobson@test.com'
const password = 'password1'

const waitForLoaderOverlayToClose = function() {
  return $browser.waitForPendingRequests(25000).then((overlay) => {
    return $browser.wait(
      $driver.until.elementIsNotVisible(
        $browser.findElement($driver.By.className('LoaderOverlay'))
      ),
      25000
    )
  })
}

const waitForElementToBeVisible = function(element) {
  return $browser.wait($driver.until.elementIsVisible(element), 5000)
}

const login = function() {
  return $browser
    .waitForAndFindElement($driver.By.name('email'))
    .then((element) => {
      element.sendKeys(`${emailAddress}\t`)
    })
    .then((emailElement) => {
      return $browser.waitForAndFindElement(
        $driver.By.css('*[name="email"] + .Input-validateSuccess'),
        5000
      )
    })
    .then(() => {
      return $browser
        .waitForAndFindElement($driver.By.name('password'))
        .then((element) => {
          element.sendKeys(`${password}\t`)
        })
    })
    .then(() => {
      return $browser.waitForAndFindElement(
        $driver.By.css('*[name="password"] + .Input-validateSuccess'),
        5000
      )
    })
    .then(() => {
      return waitForLoaderOverlayToClose()
    })
    .then(() => {
      return $browser
        .waitForAndFindElement($driver.By.className('Login-submitButton'))
        .then((element) => {
          element.click()
        })
    })
    .then(() => {
      return waitForLoaderOverlayToClose()
    })
}

const cleanUpBag = function() {
  return $browser
    .get('https://m.topshop.com/login')
    .then(() => {
      return login()
    })
    .then(() => {
      return $browser
        .findElements($driver.By.className('CheckoutContainer-viewBag'))
        .then((viewBagFromPreviousVisitButton) => {
          viewBagFromPreviousVisitButton.length === 1
            ? viewBagFromPreviousVisitButton[0].click()
            : false
        })
        .then(() => {
          return waitForLoaderOverlayToClose()
        })
        .then(() => {
          return $browser
            .navigate()
            .refresh() /** temporarily needed as there's a bug in merge bag */
        })
    })
    .then(() => {
      $browser
        .waitForAndFindElement(
          $driver.By.className('Header-shoppingCartIconbutton')
        )
        .then((element) => {
          element.click()
        })
    })
    .then(() => {
      $browser
        .findElements($driver.By.className('OrderProducts-deleteText'))
        .then((elements) => {
          for (var i = 0; i < elements.length; i++) {
            waitForElementToBeVisible(elements[i]).then(() => {
              elements[i].click()
            })
            return $browser
              .waitForAndFindElement(
                $driver.By.className('OrderProducts-deleteButton')
              )
              .then((element) => {
                element.click()
                return $browser
                  .waitForAndFindElement($driver.By.xpath("//*[text()='Ok']"))
                  .then((element) => {
                    element.click()
                  })
              })
          }
        })
    })
    .then(() => {
      return $browser.get('https://m.topshop.com/logout')
    })
}

const setUpBrowser = function() {
  return $browser
    .manage()
    .window()
    .setSize(400, 1000)
    .then(() => {
      return $browser.addHeaders({
        'X-Akamai-Logging-Mode': 'verbose',
        Pragma:
          'akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-true-cache-key, akamai-x-get-extracted-values, akamai-x-get-ssl-client-session-id, akamai-x-serial-no, akamai-x-get-request-id, akamai-x-rate-limiting-data, akamai-x-feo-trace, akamai-x-get-client-ip, akamai-x-feo-state, akamai-x-extension-on, akamai-x-get-nonces, akamai-x-tapioca-trace, akamai-x-rate-limiting-data',
      })
    })
}

setUpBrowser()
  .then(() => {
    return cleanUpBag()
  })
  .then(() => {
    return $browser.get(
      'https://m.topshop.com/en/tsuk/category/clothing-427/jackets-coats-2390889'
    )
  })
  .then(() => {
    /**
   * Can't quite figure out how to wait for the sliding animation of the menu to be finished
   *
   return $browser.waitForAndFindElement($driver.By.className('BurgerButton')).then(function (element) {
        element.click(); $browser.wait($driver.until.elementIsEnabled($browser.findElement($driver.By.xpath("//*[text()='Clothing']"))), 2000) })
   }).then(function(){
    return $browser.waitForAndFindElement($driver.By.xpath("//*[text()='Clothing']")).then(function (element) { element.click() })
}).then(function () {
    return $browser.waitForAndFindElement($driver.By.xpath("//*[text()='Jackets & Coats']")).then(function (element) { element.click() })
}).then(function () {
    */
    return $browser
      .waitForAndFindElement($driver.By.className('Product-link'))
      .then((element) => {
        element.click()
      })
  })
  .then(() => {
    return $browser
      .waitForAndFindElement($driver.By.className('AddToBag'))
      .then((element) => {
        element.click()
      })
  })
  .then(() => {
    return $browser
      .waitForAndFindElement($driver.By.className('AddToBag-goToCheckout'))
      .then((element) => {
        element.click()
      })
  })
  .then(() => {
    return login()
  })
  .then(() => {
    return $browser.waitForAndFindElement(
      $driver.By.className('QuickViewOrderSummary-button')
    )
  })
