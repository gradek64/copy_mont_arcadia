import createReducer from '../../../lib/create-reducer'
import * as formUtils from '../../../lib/form-utilities'

export default createReducer(
  {},
  {
    INIT_FORM: (state, { key }) => ({
      ...state,
      [key]: formUtils.defaultSchema(['size', 'selected']),
    }),
    SET_FORM_FIELD: (state, action) => ({
      ...state,
      [action.key]: formUtils.setFormField('bundlesAddToBag')(
        state[action.key],
        action
      ),
    }),
    SET_FORM_MESSAGE: (state, action) => ({
      ...state,
      [action.key]: formUtils.setFormMessage('bundlesAddToBag')(
        state[action.key],
        action
      ),
    }),
  }
)
