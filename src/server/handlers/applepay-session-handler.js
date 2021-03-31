import Boom from 'boom'
import fs from 'fs'
import url from 'url'
import path from 'path'
import request from 'superagent'
import allBrandsName from '../../shared/constants/allBrands'
import applepayValidationUrls from '../../shared/constants/applepay-validation-urls'
import { getSiteConfig } from '../config'

const APPLEPAY_CERTIFICATE_DIR = 'applepay/certificates'

// It reads all the certificartes available. The certificates are injected in the FS from our pipeline.
// Currently all certificates available are stored in this S3 bucket.
// https://s3.console.aws.amazon.com/s3/buckets/applepay-certificates/?region=eu-west-1&tab=overview
// Note that each brands has two certificates (Dev and Prod).
// The pipeline will inject the correct certificates depending if the aws account is prod or dev.
const certificates = allBrandsName.reduce((obj, brandName) => {
  const certificatePath = path.resolve(
    process.cwd(),
    `${APPLEPAY_CERTIFICATE_DIR}/${brandName}/applepay-cert.pem`
  )

  try {
    obj[brandName] = fs.readFileSync(certificatePath)
  } catch (err) {
    obj[brandName] = ''
  }
  return obj
}, {})

export default (req, reply) => {
  const {
    info: { hostname },
    query: { validationURL = '' },
  } = req

  const validationURLParsed = url.parse(validationURL)
  if (
    !validationURL ||
    !applepayValidationUrls.includes(validationURLParsed.hostname)
  ) {
    return reply(
      Boom.badRequest('validationUrl parameter is invalid or missing')
    )
  }

  const siteConfig = getSiteConfig(hostname)
  const { brandName, brandDisplayName: displayName } = siteConfig
  const certificate = certificates[brandName]

  if (!certificate) {
    return reply(Boom.notFound())
  }

  const merchantIdentifierDomain =
    process.env.WCS_ENVIRONMENT === 'prod' ? 'applepay' : 'test'
  const merchantIdentifier = `merchant.com.${brandName}.${merchantIdentifierDomain}`
  const body = {
    merchantIdentifier,
    displayName,
    initiative: 'web',
    initiativeContext: hostname,
  }

  return request
    .post(validationURL)
    .cert(certificate)
    .key(certificate)
    .send(body)
    .then(({ body }) => {
      reply(body)
    })
    .catch(() => {
      reply(Boom.badData('ApplePay validation session request failed'))
    })
}
