import path from 'path'

export default (req, reply) => {
  const { hostname } = req.info

  return reply
    .file(
      path.join(
        __dirname,
        `../../../applepay/validation/${hostname}/apple-developer-merchantid-domain-association.txt`
      )
    )
    .type('text/plain')
}
