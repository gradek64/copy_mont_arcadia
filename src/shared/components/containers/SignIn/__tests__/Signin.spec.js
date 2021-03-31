import React from 'react'
import PropTypes from 'prop-types'
import SignIn from '../SignIn'
import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import { shallow } from 'enzyme'

import { splitQuery } from '../../../../lib/query-helper'
import ContactBanner from '../../../common/ContactBanner/ContactBanner'

jest.mock('../../../../lib/query-helper', () => ({
  splitQuery: jest.fn(),
}))

describe('<Signin />', () => {
  const successCallback = jest.fn()
  const initialProps = {
    location: {
      hostname: 'm.topshop.com',
      pathname: '/login',
      search: '',
      query: {
        redirectUrl: '',
      },
    },
    showSessionExpiredMessage: false,
    hideRegister: false,
    successCallback,
  }
  const renderComponent = testComponentHelper(
    SignIn.WrappedComponent.WrappedComponent
  )

  describe('@renders', () => {
    it('should render default state ', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('should render a session expired message', () => {
      const modalProps = {
        ...initialProps,
        showMessage: true,
        hideRegister: true,
      }
      const component = renderComponent(modalProps)

      expect(component.getTree()).toMatchSnapshot()
      expect(component.wrapper.find(ContactBanner).exists()).toBe(false)
    })
    it('with search having return param', () => {
      expect(
        renderComponent({
          ...initialProps,
          location: {
            hostname: 'm.topshop.com',
            pathname: '/login',
            search: '',
          },
        }).getTree()
      ).toMatchSnapshot()
    })
    it('should render the contact banner component', () => {
      const component = renderComponent({
        ...initialProps,
        location: {
          hostname: 'm.topshop.com',
          pathname: '/login',
          search: '',
        },
      })

      expect(component.getTree()).toMatchSnapshot()
      expect(component.wrapper.find(ContactBanner).exists()).toBe(true)
    })
  })

  describe('@lifecycle', () => {
    describe('componentWillUnmount()', () => {
      it('should call action to update store value ', () => {
        const hideSessionExpiredMessageMock = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          showMessage: true,
          hideSessionExpiredMessage: hideSessionExpiredMessageMock,
        })
        instance.componentWillUnmount()
        expect(hideSessionExpiredMessageMock).toHaveBeenCalled()
      })
    })
  })

  describe('@props', () => {
    describe('getLoginNextRoute', () => {
      it('should return a redirect url to "/my-account" as a default option', () => {
        const { wrapper } = renderComponent(initialProps)
        const RegisterLogin = wrapper.find('RegisterLogin')
        const expected = '/my-account'
        expect(RegisterLogin.props().getLoginNextRoute()).toEqual(expected)
      })

      it('should return a redirect url to a "write a review page"', () => {
        splitQuery.mockReturnValueOnce({
          return:
            'http://local.m.dorothyperkins.com:8080/review/31982236?bvdisplaycode=6026-en_gb&bvappcode=rr&bvproductid=79134610&bvpage=http%3A%2F%2Fdorothyperkins.ugc.bazaarvoice.com%2Fsubmit%2F6026-en_gb%2F79134610%2Fsubmitreview.htm%3Fauthsourcetype%3D__AUTHTYPE__%26campaignid%3DBV_RATING_SUMMARY%26format%3Dembedded%26innerreturn%3Dhttp%253A%252F%252Fdorothyperkins.ugc.bazaarvoice.com%252F6026-en_gb%252F79134610%252Freviews.djs%253Fformat%253Dembeddedhtml%26return%3Dhttp%253A%252F%252Flocal.m.dorothyperkins.com%253A8080%252Fen%252Fdpuk%252Fproduct%252Fdresses-5699972%252Fwomens-dresses-5686813%252Fpetite-black-shirred-rose-skater-dress-7748493%26sessionparams%3D__BVSESSIONPARAMS__%26user%3D__USERID__&bvcontenttype=REVIEW_SUBMISSION&bvauthenticateuser=false',
        })
        const { wrapper } = renderComponent({
          ...initialProps,
          location: {
            pathname: '/login',
            search:
              '?return=http%3A%2F%2Flocal.m.dorothyperkins.com%3A8080%2Freview%2F31982236%3Fbvdisplaycode%3D6026-en_gb%26bvappcode%3Drr%26bvproductid%3D79134610%26bvpage%3Dhttp%253A%252F%252Fdorothyperkins.ugc.bazaarvoice.com%252Fsubmit%252F6026-en_gb%252F79134610%252Fsubmitreview.htm%253Fauthsourcetype%253D__AUTHTYPE__%2526campaignid%253DBV_RATING_SUMMARY%2526format%253Dembedded%2526innerreturn%253Dhttp%25253A%25252F%25252Fdorothyperkins.ugc.bazaarvoice.com%25252F6026-en_gb%25252F79134610%25252Freviews.djs%25253Fformat%25253Dembeddedhtml%2526return%253Dhttp%25253A%25252F%25252Flocal.m.dorothyperkins.com%25253A8080%25252Fen%25252Fdpuk%25252Fproduct%25252Fdresses-5699972%25252Fwomens-dresses-5686813%25252Fpetite-black-shirred-rose-skater-dress-7748493%2526sessionparams%253D__BVSESSIONPARAMS__%2526user%253D__USERID__%26bvcontenttype%3DREVIEW_SUBMISSION%26bvauthenticateuser%3Dfalse',
            hostname: 'local.m.dorothyperkins.com',
            protocol: 'https:',
            query: {},
          },
        })
        const RegisterLogin = wrapper.find('RegisterLogin')
        const expected =
          'review/31982236?bvdisplaycode=6026-en_gb&bvappcode=rr&bvproductid=79134610&bvpage=http%3A%2F%2Fdorothyperkins.ugc.bazaarvoice.com%2Fsubmit%2F6026-en_gb%2F79134610%2Fsubmitreview.htm%3Fauthsourcetype%3D__AUTHTYPE__%26campaignid%3DBV_RATING_SUMMARY%26format%3Dembedded%26innerreturn%3Dhttp%253A%252F%252Fdorothyperkins.ugc.bazaarvoice.com%252F6026-en_gb%252F79134610%252Freviews.djs%253Fformat%253Dembeddedhtml%26return%3Dhttp%253A%252F%252Flocal.m.dorothyperkins.com%253A8080%252Fen%252Fdpuk%252Fproduct%252Fdresses-5699972%252Fwomens-dresses-5686813%252Fpetite-black-shirred-rose-skater-dress-7748493%26sessionparams%3D__BVSESSIONPARAMS__%26user%3D__USERID__&bvcontenttype=REVIEW_SUBMISSION&bvauthenticateuser=false'
        expect(RegisterLogin.props().getLoginNextRoute()).toEqual(expected)
      })

      it('should redirect to the redirectUrl if provided', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          location: {
            query: {
              redirectUrl: '/',
            },
          },
        })
        const RegisterLogin = wrapper.find('RegisterLogin')
        const expected = '/'
        expect(RegisterLogin.props().getLoginNextRoute()).toEqual(expected)
      })
    })

    describe('getRegisterNextRoute', () => {
      it('should return /my-account if redirectUrl is an empty string', () => {
        const { wrapper } = renderComponent(initialProps)
        const RegisterLogin = wrapper.find('RegisterLogin')
        const expected = '/my-account'
        expect(RegisterLogin.props().getRegisterNextRoute()).toEqual(expected)
      })
    })

    describe('successCallback', () => {
      it('should default to a function', () => {
        const { instance } = renderComponent({
          ...initialProps,
          successCallback: undefined,
        })

        const callbackProp = instance.props.successCallback

        expect(typeof callbackProp).toBe('function')
      })

      it('should pass the successCallback along to the register form', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          hideRegister: true,
          closeModal: () => {},
        })

        const passedCallback = wrapper
          .find('RegisterLogin')
          .prop('successCallback')

        passedCallback()

        expect(successCallback).toHaveBeenCalled()
      })
    })
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(SignIn, 'register-login', {
      componentName: 'SignIn',
      redux: true,
    })
  })

  describe('mapStateToProps', () => {
    it('builds props from state', () => {
      const store = {
        subscribe: () => {},
        dispatch: () => {},
        getState: () => ({
          config: {},
          errorSession: {
            showSessionExpiredMessag: false,
          },
          routing: {
            location: {
              hostname: 'm.topshop.com',
              pathname: '/login',
              search: '',
            },
            visited: ['/'],
          },
          loaderOverlay: {
            visible: false,
          },
          products: [],
          account: {},
          forms: {
            register: {
              fields: [],
            },
          },
        }),
      }

      const wrapper = shallow(<SignIn store={store} />, {
        context: {
          l: () => {},
          store,
        },
        childContextTypes: {
          l: PropTypes.func,
          store: PropTypes.object,
        },
      })

      expect(
        wrapper
          .dive()
          .dive()
          .props()
      ).toMatchObject({
        location: {
          hostname: 'm.topshop.com',
          pathname: '/login',
          search: '',
        },
      })
    })
  })
})
