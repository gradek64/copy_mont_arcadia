// Builds a 3D Secure form capable of sending the necessary payload
// to a third party verification service e.g. WorldPay.
export function createRawThreeDSecure1Form({
  action,
  md,
  paReq,
  orderCompleteReturnUrl,
  includeSubmitScript = false,
  formId = null,
}) {
  const childElements = [
    `<input type='hidden' name='TermUrl' value='${orderCompleteReturnUrl}'/>`,
    `<input type='hidden' name='MD' value='${md}'/>`,
    `<textarea style='display:none;' name='PaReq'>${paReq}</textarea>`,
  ]

  const formElement =
    `<form ${
      formId ? `id='${formId}' ` : ''
    }method='post' action='${action}'>` +
    `${childElements.join('')}` +
    `</form>`

  const submitScript = `<script language='text/javascript' type='text/javascript'>document.getElementsByTagName('form')[0].submit();</script>`

  return includeSubmitScript ? `${formElement}${submitScript}` : formElement
}

// Appends the query parameters from the wcsReturnUrl to the montyReturnUrl
// before building the 3D Secure Form
export function createThreeDSecure1Form({
  action,
  md,
  paReq,
  montyReturnUrl,
  wcsReturnUrl,
}) {
  const wcsQueryParameters = wcsReturnUrl.split('?')[1]
  const urlWithAdditionalParams = `${montyReturnUrl}&${wcsQueryParameters}`

  return createRawThreeDSecure1Form({
    action,
    md,
    paReq,
    orderCompleteReturnUrl: urlWithAdditionalParams,
    formId: 'paymentForm',
  })
}

export function createThreeDSecureFlexForm({ challengeJwt, challengeUrl, md }) {
  const formId = 'paymentForm'

  const childElements = [
    `<input type='hidden' name='JWT' value='${challengeJwt}'/>`,
  ]

  if (md) {
    childElements.push(`<input type='hidden' name='MD' value='${md}'/>`)
  }

  const formElement =
    `<form id='${formId}' method='post' action='${challengeUrl}'>` +
    `${childElements.join('')}` +
    `</form>`

  return formElement
}
