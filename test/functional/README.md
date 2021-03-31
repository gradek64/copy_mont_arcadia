# Acceptance Tests for full-monty [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Getting started
- install cypress 3.3.1 globally `npm install -g cypress@3.3.1`
- after install make sure you are at the root of the full-monty project and run `npm install` 

## Run Cypress via CLI
- from the root of the monty folder run `npm run functional:cli`
  - this command will run it all for you and will start cypress with the mock server 
- simply follow and choose the options that you require.
  - this command will run it all for you and will start cypress with the mock server
  - DEV or BUILD
    - Dev => this will run a dev build of Monty
    - Build => This will run a prod build of Monty
  - Desktop VS Mobile
    - Desktop => run Cypress suite on a desktop viewport
    - Mobile => run Cypress suite on a mobile viewport
  - Open Vs Run
    - Open => see the cypress browser open, with the dialogue to choose test to run
    - Run => run headless cypress browser
  - Rerun failures
    - No => will not retry to run failing test
    - Yes => will try to rerun a failing test 3 times before, failing the test
       
## Run cypress Manually
- Start full-monty: `npm run build`
- Start cypress & mock server, using desktop view: `npm run functional`
  - For mobile view, do `npm run functional:mobile`

- Run only a subset of feature files (uses headless mode by standard!):
  - First start the mock server: `node mock-server/`
  - Run the tests: `npm run fromcli -- --spec=cypress/integration/features/pdp*.js`
  - Use `npm run fromcli:mobile` for testing in mobile mode
  - Use `npm run cy:run  -- spec=cypress/integration/features/pdp*.js` to generate the [mochawesome](#reporting) report

## Settings
All settings are being passed via environment variables: either by putting it in
front of the start script (i.e. `BREAKPOINT=mobile npm start`) or by
placing them in an `.env` file in the root of the project.

| Setting        | Explanation  | Default  |
| ------------- |:-------------:| -----:|
| `BREAKPOINT=mobile`   | Test either `mobile` or `desktop` site of full-monty. | desktop |
| `LOW_MEMORY=true` | When running all of the tests; prevents Cypress from running out of memory | false |

# Monty environment variables
- `FUNCTIONAL_TESTS=true` - This causes monty to override `window.fetch` with
an XHR polyfill. This is due to Cypress not mocking `fetch`
- `CORE_API_PORT=4000` - This ensures monty calls the mock server on port 4000
instead of itself (CoreAPI requests).

## Why do we have these tests?
These tests should test Monty code without depending on other services, such as
WCS. We have unit tests for testing the nitty gritty details of our code but
these don't give us great confidence that a feature as a whole is working as
expected. We have End to End (E2E) tests that give us a great level of
confidence but are much slower and are more costly to maintain as they test the
entire stack.

These functional acceptance tests should cover the acceptance criterea of our
stories so that we don't need to do as much manual testing.

## Who writes and maintains these tests?
These tests may be primarily written by testers but developers should feel
comfortable contributing to them also. We should work together in our squads to
be confident in the code we release.

# Mock server
## Why is there a mock server? Doesn't Cypress already mock requests?
Yes but Cypress only mocks requests from the client, not the server.

![Interaction diagram between cypress, monty and the mock
server](./cypress-mock-server.png)

This diagram explains that the first request for a page causes Monty to do a
server side render which in turn causes more requests to be made. These API
requests are directed towards the mock server. Once the page has loaded in the
browser, cypress takes control of mocking the response.

## Getting started
- Start full-monty with the environment variables `CORE_API_PORT=4000`,
  `QUBIT_DISABLED=true` and `FUNCTIONAL_TESTS=true`
- Set up some mocks to be used by full-monty by placing them inside
  `mock-server/routes.js`
- Initialise these mocks to be used by full-monty as well as by cypress by
  calling it at the beginning of your test file. Below example is a modified
  example from the function `setupMocksForInitialRenderOnPdp` to underline how
  the stubbing works under the hood.
```javascript
import getPDPRoutes from './../../mock-server/routes'
import setRoute from './../../mock-server/setRoute'

const path = '/en/product/mySuperCoolMockIsHere'
const routes = [
  {
      method: 'GET',
      url: '/cmscontent?storeCode=tsuk&brandName=topshop',
      response: fixtures.cms.cmscontent, // some JSON the mock will reply with
  },
  {
      method: 'POST',
      url: '/api/client-info',
      response: {},
  },
  {
      method: 'GET',
      url: '/api/navigation/categories',
      response: fixtures.general.categories, // some JSON the mock will reply with
  }
]
routes.map(setRoute)    // Calls the `setRoute` function for every route on our full-monty mock server
cy.server()             // Initialises the cypress mock server
routes.map(cy.route)    // Sets up all the routes also to be mocked by cypress itself
cy.visit(path)
```

## API
- Show all server mocks: go to `localhost:400/mocks`
- You can also on the fly add and delete the mocks via `POST` and `DELETE` to
  `localhost:4000/mocks`

## How do I know which requests need to be setup for server-side render in full-monty?
Welcome to the tricky bit. In order to identify which network requests are being
made when full-monty initially starts on a page (i.e. doing a server-side
render), we need to pay particular attention to the full-monty terminal output.

Make sure to have the following environment variables set inside full-monty (or
in some cases __not__ set):
```bash
LOGGING_LEVEL=TRACE
USE_NEW_HANDLER=true
# The below should be commented out/deactivated
# LOGGING_LEVEL_FORMAT=STRING
# DEBUG=monty:*
```

Now, when you run full-monty as usual (with using `npm run dev` without any
cypress specific environment variables), we can start spying out the server-side
render requests. For example, let's go to a product page in our browser. After
you did so, clear the output of your terminal (`Cmd + K` in iTerm2) and perform
a **hard** refresh in your browser window - this will initiate a server-sider
render.

If you have done this correctly, full-monty will now put out **a lot** of stuff
to your terminal window. But we are only interested in those requests which have
a `loggerMessage=response` and a `namespace=hapi-server` on them. (_Cheat code_:
Copy the entire terminal output into a text file and then search it via your
text editor using regex. The following one gives you everything you are
interested in: `^(.*)loggerMessage=response(.*)namespace=hapi-server(.*)$`) An
example:

```text
[2018-07-19T10:57:24.496Z]  INFO: monty/14885 on localhost:  (loggerMessage=response, method=GET, path=/api/footers, query={}, source=CoreAPI, traceId=1531997844040R373215, brandCode=tsuk, statusCode=200, namespace=hapi-server)      "user-agent": "node-superagent/2.0.0",
      "brand-code": "tsuk",
      "cookie": "jsessionid=eyJhbGciOiJIUzI1NiJ9.ZTc3MjNjMDMtOGUyMi00MDFjLTlhYjYtZTliNzcyZGZhN2Nm.lgcZ_cXiRkXhIX6i-RXCAcmEEWV7skqW5mTiiFZStgw; deviceType=desktop",
      "x-trace-id": "1531997844040R373215",
      "connection": "close"
    }
    --
    sessionKey: eyJhbGciOiJIUzI1NiJ9.ZTc3MjNjMDMtOGUyMi00MDFjLTlhYjYtZTliNzcyZGZhN2Nm.lgcZ_cXiRkXhIX6i-RXCAcmEEWV7skqW5mTiiFZStgw
    --
    bsessionKey: eyJhbGciOiJIUzI1NiJ9.ZTc3MjNjMDMtOGUyMi00MDFjLTlhYjYtZTliNzcyZGZhN2Nm.lgcZ_cXiRkXhIX6i-RXCAcmEEWV7skqW5mTiiFZStgw
    --
    payload: {
      "pageId": "139962",
      ...
      ...
    }
```

Well, and there you have it! Now you know that the PDP on server-side render
needs a mock for the URL `/api/footers`. Take the `payload` you see in the
terminal and respond straight with it - that way the mock server now serves it
directly to full-monty without any network requests.

# Writing Tests - How To
- Your tests should ideally use stubs and mocks for all the data coming from the
  server which might change, i.e. a product. See the section [about the mock
  server](#Mock-server) to learn more about how to do this.
  - Rule of thumb: Mock what you have to, leave ummocked what you think might
    otherwise give a false positive.

# Style Guide
## Page Objects
**Since we are not using cucumber, we should ideally bring as much as we can
into page objects so that already existing functionality can easily be reused by
everone in the team.**

Bring as much as you can into the page object but leave out things which are
very specific to a certain test and cannot be reused. A good example for this
would be stubs and mocks: Since another test might use a different product,
setting up a mock inside a page object is far from ideal.

Split the page object as following:
- Top of the file - Selectors used to represent the DOM elements
- Middle of the file - Functionality to interact with the page element
- Bottom of the file - Actions performed by the user or composed functions

**Important**: When performing a click, page object methods should always wait
for something to happen so as to not cause race conditions in how cypress
calls the next function in queue. Waiting for the end result can easily be done
via `.get()`, i.e. when click on the quick view icon, you should wait for the
modal to appear, via:
```javascript
cy.get(this.quickViewButton).click().get(Pdp.addToBagButton)
```
If your clicking method is already followed by another methods which asserts
that the action worked, then an additional wait is not necessary.

### Selectors - Collect selectors inside JavaScript classes
```javascript
export default class Pdp {
    get addToBagButton() {
        return '.AddToBag .Button'
    }
    get sizeSelectionDropdown() {
        return '.Select-container .Select-select'
    }
}
```

## Configuration
- We do not use the regular `cypress.json` as we want to be able to use dynamic
  settings determined by environment variables. Thus, all our configuration can
  be found in `plugins/index.js` by exporting a configuration object to cypress
  before startup.


## Reporting
  - We use mochawsome for reporting purpuses. Inside the `cypress.json`, we explicitly
  declare the reporting folder naming convention and set overwrite to false. This is because
  mocha creates reports individually for each spec. So to overcome having multiple reports, we use
  a script `run.js` which sits inside the scripts folder.

  The `run.js` file has been created to do the merging of reports, once the cypress tests have run. Therefore it
  is imperative that if you require reports, then this script is used when running tests.

  Example:
  Run the tests: `npm run cy:run` -- this points to the run.js file


## Naming Conventions
- Directories are being hyphenated, e.g. `mini-bag`, `my-account`
- Use PascalCase for file names referring to components, e.g. `MiniBag`,
  `ProductPage`, `MyAccount`
- Use camelCase for file names referring to javascript functions, e.g. `shared`,
  `helpers`
- camelCase when naming objects
- camelCase when naming references
- camelCase when naming selector
- export/import modules should have the same format
```javascript
import MiniBag from './MiniBag'
import testFunction from './testFunction'
```
- Constant in camelCase if part of the same file
```javascript
 const myConstant = 'value';
 ```
