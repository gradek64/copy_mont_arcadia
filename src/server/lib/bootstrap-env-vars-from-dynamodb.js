import * as logger from './logger'
import AWS from 'aws-sdk'

const region = process.env.APP_CONFIG_REGION
  ? process.env.APP_CONFIG_REGION
  : 'eu-west-1'

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID_DYNAMODB,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_DYNAMODB,
  region,
})
AWS.config.dynamodb = { endpoint: `https://dynamodb.${region}.amazonaws.com` }
const dynamodb = new AWS.DynamoDB.DocumentClient()

export default function bootstrapEnvVarsFromDynamoDB(cb) {
  dynamodb.scan(
    {
      TableName: process.env.APP_CONFIG_TABLENAME,
    },
    (err, { Items }) => {
      if (err) {
        logger.error(
          'Error occurred attempting to fetch env vars from DynamoDB, trying again...'
        )
        bootstrapEnvVarsFromDynamoDB()
      } else {
        Items.map(({ key, value }) => {
          process.env[key] = value
          return value
        })
        if (cb) cb()
      }
    }
  )
}
