# Third party integration test suite [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

### Instructions

 `npm run integration:validate-third-parties` to run all tests in the `third-parties`folder
    

Use npx to run an individual or subset of tests: e.g. 'BazaarVoice'
```diff
npx jest --config=./build/integration/jest.config.js test/apiResponses/third-parties/**/*baz*.spec.js
``` 
