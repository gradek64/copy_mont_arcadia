import { pathOr, uniq } from 'ramda'
import AWS from 'aws-sdk'
import fs from 'fs'
import * as logger from '../lib/logger'
import chokidar from 'chokidar'

let features = {}

const localFeaturePath = 'packages/monty-feature-flags/features.json'

function loadLocalFeatures() {
  let fileContents = null

  try {
    fileContents = fs.readFileSync(localFeaturePath, 'utf8')
    logger.info('features-service', {
      loggerMessage: 'Read local feature file',
    })
  } catch (e) {
    logger.error(
      `failed to read file "${localFeaturePath}", make sure it exists`
    )
    logger.error(e)
    process.exit(1)
  }

  try {
    features = JSON.parse(fileContents)
    logger.info('features-service', {
      loggerMessage: 'Parsed local features',
    })
  } catch (e) {
    logger.error(
      `failed to parse ${localFeaturePath}, make sure it is well formed JSON`
    )
    logger.error(e)
    process.exit(1)
  }
}

loadLocalFeatures()

if (process.env.NODE_ENV !== 'production')
  chokidar.watch(localFeaturePath).on('all', loadLocalFeatures)

function loadFeaturesFromS3() {
  const s3 = new AWS.S3({
    signatureVersion: 'v4',
  })

  s3.getObject(
    {
      Bucket: process.env.FEATURE_FLAG_BUCKET,
      Key: `${process.env.ENVIRONMENT_NAME}/${process.env.FEATURE_FLAG_KEY}`,
    },
    (err, res) => {
      if (err) {
        logger.error('features-service', { loggerMessage: err.message }) // an error occurred
      } else {
        logger.info('features-service', {
          loggerMessage: JSON.parse(res.Body.toString()),
        })
        features = JSON.parse(res.Body.toString())
      }
    }
  )
}

export const updateFeatures = () => {
  if (process.env.NODE_ENV === 'production') {
    loadFeaturesFromS3()
  } else {
    loadLocalFeatures()
  }
}

export const getFeatures = ({ brandCode, region }) => {
  const brandFeatures = pathOr([], [brandCode, region], features)
  return uniq([...features.common, ...brandFeatures])
}

export const getAllFeatures = () => {
  return features
}

export default {
  getFeatures,
  updateFeatures,
  getAllFeatures,
}
