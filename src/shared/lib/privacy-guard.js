import PropTypes from 'prop-types'
import { Children, cloneElement, isValidElement } from 'react'

const PROTECTOR_TEXT_CLASSNAME = 'sessioncamhidetext'
const PROTECTOR_FIELDS_CLASSNAME = 'sessioncamexclude'

/* Protect customers privacy with disallowing to record their sensitive
 * input by SessionCam.
 *
 * For SessionCam 3rd party on TopMan (although it is applied for all
 * brands we can put it behind a feature flag at any time)
 * https://help.sessioncam.com/hc/en-gb/articles/200863776-Disable-recording-of-page-text
 *
 * @example
 * // returns <div class="someClass sessioncamhidetext">Some text</div>
 * <PrivacyGuard><div className="someClass">Some text</div>
 *
 * @example
 * // returns <input class="someClass sessioncamhidetext"/>
 * <PrivacyGuard><input className="someClass" value="text"></input>
 *
 * @example
 * // returns <select className="sessioncamexclude"><option className="sessioncamexclude">option</option></select>
 * <PrivacyGuard>
 *  <select>
 *   <option>option</option>
 *  </select>
 * </PrivacyGuard>
 *
 * @example
 * // returns <div class="someClass">Some text</div>
 * <PrivacyGuard noProtection={true}><div className="someClass">Some text</div>
 */
function PrivacyGuard({ children, noProtection }) {
  const isPasswordField = (component) => {
    return (
      component &&
      component.type === 'input' &&
      component.props &&
      component.props.type === 'password'
    )
  }

  const protectorClassName = (type) => {
    if (typeof type !== 'string') {
      throw new Error('Type has to be defined and it has to be a string.')
    }
    switch (type) {
      // "Just to confirm the class 'sessioncamexclude' can only be used for field
      // masking. So you can use it for input, text areas and drop down menu's."
      //  - SessionCam Support
      case 'input':
      case 'textarea':
      case 'select':
      case 'option':
        return PROTECTOR_FIELDS_CLASSNAME
      default:
        return PROTECTOR_TEXT_CLASSNAME
    }
  }

  const createProtectedComponent = (child) => {
    if (!isValidElement(child)) {
      return child
    }
    if (child.props.children) {
      // example:
      //   const someNumber = 123
      //   return <div> {someNumber}</div>
      // The <div/> children's size will be 1 but its content will be an array: [' ', 123] so we need to use forEach.
      Children.forEach(child.props.children, (child) => {
        if (!(typeof child === 'string' || typeof child === 'number')) {
          throw new Error(
            `You can only wrap a single element with <PrivacyGuard/> and that element can have at most one text (string or number) child (the reason behind this that the class (${PROTECTOR_TEXT_CLASSNAME}/${PROTECTOR_FIELDS_CLASSNAME}) must be added to the inner most html element containing the text)`
          )
        }
      })
    }
    const {
      props: { className },
      type,
    } = child
    return cloneElement(child, {
      className: `${className ? `${className} ` : ''}${protectorClassName(
        type
      )}`,
    })
  }

  if (noProtection || isPasswordField(children)) {
    return children
  }
  if (!children) {
    throw new Error(
      '<PrivacyGuard/> must have a child. For eg.: <PrivacyGuard><span>sensitive content</span></PrivacyGuard>'
    )
  }
  if (Children.count(children) > 1) {
    throw new Error(
      '<PrivacyGuard/> must have a child and only one child. For eg.: <PrivacyGuard><span>sensitive content</span></PrivacyGuard>'
    )
  }
  Children.forEach(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      throw new Error(
        `<PrivacyGuard/> has to contain a component. For eg.: use <PrivacyGuard><span>sensitive content</span></PrivacyGuard> instead of <PrivacyGuard>sensitive content</PrivacyGuard>`
      )
    }
  })
  if (children.type === 'select') {
    const {
      props: { className },
      type,
    } = children
    return cloneElement(
      children,
      {
        className: `${className ? `${className} ` : ''}${protectorClassName(
          type
        )}`,
      },
      Children.map(children.props.children, createProtectedComponent)
    )
  }
  return createProtectedComponent(children)
}

PrivacyGuard.propTypes = {
  noProtection: PropTypes.bool,
}

export { PrivacyGuard }
