import { Server } from 'hapi'
import snsTopicHandler from './handlers/sns-topic-handler'

const snsServer = new Server({
  connections: {
    routes: { security: { hsts: false } },
  },
})

snsServer.connection({ port: 9000, state: { strictHeader: false } })
snsServer.route([
  {
    method: 'POST',
    path: '/sns-topic',
    handler: snsTopicHandler,
  },
])

export default snsServer
