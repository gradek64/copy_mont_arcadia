/* eslint-disable */
import nock from 'nock'
import superagent from '../../../src/shared/lib/superagent'

describe('Superagent caching', () => {
  it('persists content for subsequent requests', (done) => {
    nock('http://localhost:80')
      .get('/cache-test')
      .reply(200, { count: 1 })

    superagent
      .get('/cache-test')
      .cache(600)
      .end((error) => {
        nock('http://localhost:80')
          .get('/cache-test')
          .reply(200, { count: 2 })

        superagent
          .get('/cache-test')
          .cache(600)
          .end((error, response) => {
            expect(response.body.count).toBe(1)
            done()
          })
      })
  })

  it('does not persist requests set to timeout immediately', (done) => {
    nock('http://localhost:80')
      .get('/cache-test-2')
      .reply(200, { count: 1 })

    superagent
      .get('/cache-test-2')
      .cache(0)
      .end((error) => {
        nock('http://localhost:80')
          .get('/cache-test-2')
          .reply(200, { count: 2 })

        superagent
          .get('/cache-test-2')
          .cache(600)
          .end((error, response) => {
            expect(response.body.count).toBe(2)
            done()
          })
      })
  })

  it('does not persist content with scrAPI specific error flag (success: false)', (done) => {
    nock('http://localhost:80')
      .get('/cache-test-3')
      .reply(200, { count: 1, success: false })

    superagent
      .get('/cache-test-3')
      .cache(600)
      .end((error) => {
        nock('http://localhost:80')
          .get('/cache-test-3')
          .reply(200, { count: 2 })

        superagent
          .get('/cache-test-3')
          .cache(600)
          .end((error, response) => {
            expect(response.body.count).toBe(2)
            done()
          })
      })
  })

  it('does not persist content with scrAPI specific error flag (statusCode: 422)', (done) => {
    nock('http://localhost:80')
      .get('/cache-test-4')
      .reply(200, { count: 1, statusCode: 422 })

    superagent
      .get('/cache-test-4')
      .cache(600)
      .end((error) => {
        nock('http://localhost:80')
          .get('/cache-test-4')
          .reply(200, { count: 2 })

        superagent
          .get('/cache-test-4')
          .cache(600)
          .end((error, response) => {
            expect(response.body.count).toBe(2)
            done()
          })
      })
  })

  it('does not persist non 200 responses', (done) => {
    nock('http://localhost:80')
      .get('/cache-test-4')
      .reply(500, { count: 1 })

    superagent
      .get('/cache-test-4')
      .cache(600)
      .end((error) => {
        nock('http://localhost:80')
          .get('/cache-test-4')
          .reply(200, { count: 2 })

        superagent
          .get('/cache-test-4')
          .cache(600)
          .end((error, response) => {
            expect(response.body.count).toBe(2)
            done()
          })
      })
  })

  it('respects timeout', (done) => {
    nock('http://localhost:80')
      .get('/cache-test-6')
      .reply(200, { count: 1 })

    superagent
      .get('/cache-test-6')
      .cache(1)
      .end((error) => {
        nock('http://localhost:80')
          .get('/cache-test-6')
          .reply(200, { count: 2 })

        superagent
          .get('/cache-test-6')
          .cache(600)
          .end((error, response) => {
            expect(response.body.count).toBe(1)
            setTimeout(() => {
              superagent
                .get('/cache-test-6')
                .cache(600)
                .end((error, response) => {
                  expect(response.body.count).toBe(2)
                  done()
                })
            }, 1000)
          })
      })
  })
})
