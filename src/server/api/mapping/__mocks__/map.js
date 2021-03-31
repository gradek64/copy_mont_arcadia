import FakeSpecificMapper from './FakeSpecificMapper'
import FakeSpecificMapperFactory from './FakeSpecificMapperFactory'

export default [
  {
    re: /^\/api\/site-options$/,
    method: 'get',
    handler: FakeSpecificMapper,
  },
  {
    re: /^\/api\/products\/\d+$/,
    method: 'get',
    handler: FakeSpecificMapper,
  },
  {
    re: /^\/api\/factoryendpoint$/,
    method: 'get',
    handler: FakeSpecificMapperFactory,
  },
]
