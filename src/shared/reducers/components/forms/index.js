import { combineReducers } from 'redux'
import { assocPath, evolve } from 'ramda'
import * as formUtils from '../../../lib/form-utilities'
import bundlesAddToBag from './bundlesAddToBag'
import checkout from './checkout'
import account from './accountFormReducer'
import createFormReducer from './createFormReducer'
import addressBook from './addressBookFormReducer'

// Please keep in alphabetical order for easier debugging with redux dev tools
export default combineReducers({
  account,
  addressBook,
  bundlesAddToBag,
  checkout,
  changePassword: createFormReducer('changePassword', [
    'email',
    'oldPassword',
    'newPassword',
  ]),
  cmsForm: createFormReducer('cmsForm', [], {
    SET_CMS_FORM_DEFAULT_SCHEMA: (state, { fields }) => ({
      ...state,
      ...formUtils.defaultSchema(fields),
    }),
  }),
  customerDetails: createFormReducer(
    'customerDetails',
    [
      'title',
      'firstName',
      'lastName',
      'telephone',
      'country',
      'postcode',
      'address1',
      'address2',
      'city',
      'state',
      'type',
      'cardNumber',
      'expiryMonth',
      'expiryYear',
    ],
    {
      CLOSE_MODAL: (state) => ({ ...state, modalOpen: false }),
    }
  ),
  customerShortProfile: createFormReducer(
    'customerShortProfile',
    ['title', 'firstName', 'lastName', 'email'],
    {
      SET_FORM_SUCCESS: formUtils.setFormSuccess('customerShortProfile'),
    }
  ),
  forgetPassword: createFormReducer('forgetPassword', ['email']),
  login: createFormReducer('login', ['email', 'password', 'rememberMe']),
  wishlistLoginModal: createFormReducer('wishlistLoginModal', [
    'email',
    'password',
    'rememberMe',
  ]),
  notifyStock: createFormReducer(
    'notifyStock',
    ['firstName', 'surname', 'email', 'state'],
    {
      EMAIL_ME_STOCK_SUCCESS: (state, { body: { message } }) =>
        assocPath(['fields', 'state', 'value'], message, state),
    }
  ),
  promotionCode: createFormReducer('promotionCode', ['promotionCode'], {
    TOGGLE_ACCORDION: (state, { key }) => {
      if (key === 'promotionInfo') {
        const transform = {
          fields: {
            promotionCode: () => ({
              value: null,
              isDirty: false,
              isTouched: false,
            }),
          },
          isVisible: () => false,
          message: () => ({}),
        }
        return evolve(transform, state)
      }
      return state
    },
  }),
  register: createFormReducer('register', [
    'email',
    'password',
    'subscribe',
    'rememberMeRegister',
  ]),
  registerLogin: createFormReducer('registerLogin', [
    'email',
    'password',
    'confirmPassword',
    'subscribe',
  ]),
  resetPassword: createFormReducer('resetPassword', ['email', 'password']),
  search: createFormReducer('search', ['searchTerm']),
  storeDelivery: createFormReducer('storeDelivery', ['postcode']),
  userLocator: createFormReducer('userLocator', ['userLocation']),
  giftCard: createFormReducer('giftCard', ['giftCardNumber', 'pin']),
  footerNewsletter: createFormReducer('footerNewsletter', ['email']),
})
