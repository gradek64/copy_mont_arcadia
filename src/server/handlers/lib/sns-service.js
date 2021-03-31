import crypto from 'crypto'
import url from 'url'
import https from 'https'
import * as logger from '../../lib/logger'
import bootstrapEnvVarsFromDynamoDB from '../../lib/bootstrap-env-vars-from-dynamodb'
import { updateFeatures } from '../../lib/features-service'
import { contains } from 'ramda'

// Local memory cache for PEM certificates
const pemCache = {}

const REQUIRED_KEYS = [
  'Type',
  'MessageId',
  'TopicArn',
  'Message',
  'Timestamp',
  'SignatureVersion',
  'Signature',
  'SigningCertUrl',
]

function buildSignatureString(message) {
  const chunks = []
  if (message.Type === 'Notification') {
    chunks.push('Message')
    chunks.push(message.Message)
    chunks.push('MessageId')
    chunks.push(message.MessageId)
    if (message.Subject) {
      chunks.push('Subject')
      chunks.push(message.Subject)
    }
    chunks.push('Timestamp')
    chunks.push(message.Timestamp)
    chunks.push('TopicArn')
    chunks.push(message.TopicArn)
    chunks.push('Type')
    chunks.push(message.Type)
  } else if (message.Type === 'SubscriptionConfirmation') {
    chunks.push('Message')
    chunks.push(message.Message)
    chunks.push('MessageId')
    chunks.push(message.MessageId)
    chunks.push('SubscribeURL')
    chunks.push(message.SubscribeURL)
    chunks.push('Timestamp')
    chunks.push(message.Timestamp)
    chunks.push('Token')
    chunks.push(message.Token)
    chunks.push('TopicArn')
    chunks.push(message.TopicArn)
    chunks.push('Type')
    chunks.push(message.Type)
  } else {
    return false
  }

  return `${chunks.join('\n')}\n`
}

function validateMessage(pem, message, cb) {
  const msg = buildSignatureString(message)
  if (!msg) return cb(new Error('Invalid sns request'))

  const verifier = crypto.createVerify('RSA-SHA1')
  verifier.update(msg, 'utf8')
  return verifier.verify(pem, message.Signature, 'base64')
    ? cb(null, message)
    : cb(new Error('Invalid sns request: Invalid certificate'))
}

/**
 * An array, of valid sns topic arn's
 */
const validArns = [
  process.env.FEATURE_FLAG_TOPIC_ARN,
  process.env.APP_CONFIG_SNS_TOPIC_ARN,
]

const validateArn = (arn) => contains(arn, validArns)

export function validateSnsRequest(message, cb) {
  if (!REQUIRED_KEYS.map((key) => key in message))
    return cb(new Error('Invalid sns request'))

  const cert = url.parse(message.SigningCertUrl)
  const arn = message.TopicArn.split(':')

  if (!arn || arn.length !== 6 || !validateArn(message.TopicArn))
    return cb(new Error(`Invalid sns request: Invalid ARN topic`))

  if (cert.host !== `sns.${arn[3]}.amazonaws.com`)
    return cb(new Error(`Invalid sns request: Invalid host`))

  // check if certificate has been downloaded before and cached
  if (message.SigningCertUrl in pemCache) {
    const pem = pemCache[message.SigningCertUrl]
    return validateMessage(pem, message, cb)
  }
  return https.get(cert, (res) => {
    const chunks = []
    res.on('data', (chunk) => {
      chunks.push(chunk)
    })
    res.on('end', () => {
      const pem = chunks.join('')
      pemCache[message.SigningCertUrl] = pem
      return validateMessage(pem, message, cb)
    })
    res.on('error', () => {
      return cb(new Error('Could not download sns certificate.'))
    })
  })
}

export function handleSnsMessage(message) {
  if (message.includes('reload appConfig')) {
    bootstrapEnvVarsFromDynamoDB(
      logger.info('sns-service', {
        loggerMessage:
          'Reloading application configuration due to SNS Notification',
      })
    )
    return 'Application configuration reload successful!'
  } else if (
    message.includes(
      `${process.env.ENVIRONMENT_NAME}/${process.env.FEATURE_FLAG_KEY}`
    )
  ) {
    return updateFeatures()
  }
  return 'SNS notification type unrecognized.'
}
