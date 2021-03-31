CoreAPI Integration Tests
=========================

# How to run
- Launch full-monty on port 3000 (via `npm run e2e`)
- Run `npm run integration:coreapi` to launch the tests

# Development tips
- To only run a specific test file if necessary `npx jest --config=./build/integration/jest.config.js test/apiResponses/coreapi/logon/logon.spec.js`
- Change test blocks to `describe.only` or `fdescribe` or `it.only` if you only want to run specific tests
- Pass the `--watch` command down to jest so that the tests will rerun every time you make a change: `npm run integration:coreapi -- --watch`
