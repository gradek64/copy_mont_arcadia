# TODO: WCS API Layer


- [x] add `catalogId` and `langId` to all the brand configuration
  right now that information has been added only for `tsuk`
- [ ] an internal server error occurs if Redis server is down. Handle the scenario gracefully.
- [ ] map the error responses for siteOptions
- [x] navigation
  - [x] decide how to handle navigation desktop
    - create a new monty hapi endpoint dedicated to the desktop navigation
        In this case the navigationActions remains untouched.
        Once the desktop navigation is implemented another dedicated action needs
        to be created and another Store property will be created to contain the desktop navigation object.
- [ ] error management
    - throw an error from api.js and you should the error `UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 2): Error: reply interface called twice`.
    This needs to be fixed and the mapping of the error responses needs to be done for all endpoints by overriding the mapper function `mapResponseError`
