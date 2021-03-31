/* eslint-disable no-undef */
// TODO remove System and eslint-disable

import React from 'react'
import Quiz from '../shared/components/containers/Quiz/Quiz'

export const getTemplateComponent = (template, props = {}) => {
  if (template === 'quiz') return <Quiz {...props} />

  return false
}

export default {
  getTemplateComponent,
}
