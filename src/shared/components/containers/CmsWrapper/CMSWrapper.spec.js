import React from 'react'
import { shallow } from 'enzyme'
import CMSWrapper from './CmsWrapper'
import Helmet from 'react-helmet'
import CmsNotAvailable from '../../common/CmsNotAvailable/CmsNotAvailable'
import Loader from '../../common/Loader/Loader'
import TermsAndConditions from '../TermsAndConditions/TermsAndConditions'
import CmsForm from '../CmsForm/CmsForm'

const generatedAssets = {
  chunks: {
    0: 'common/0.js',
    1: 'common/1.js',
    2: 'common/2.js',
    3: 'common/3.js',
    4: 'common/4.js',
    5: 'common/5.js',
  },
  css: {
    'topshop/styles-desktop.css': '/assets/topshop/styles-desktop.css',
    'topshop/styles-grid.css': '/assets/topshop/styles-grid.css',
    'topshop/styles-laptop.css': '/assets/topshop/styles-laptop.css',
    'topshop/styles-tablet.css': '/assets/topshop/styles-tablet.css',
    'topshop/styles.css': '/assets/topshop/styles.css',
  },
  js: {
    'common/0.js': '/assets/common/0.js',
    'common/1.js': '/assets/common/1.js',
    'common/bundle.js': '/assets/common/bundle.js',
    'common/service-desk.js': '/assets/common/service-desk.js',
    'common/vendor.js': '/assets/common/vendor.js',
  },
}

describe('<CmsWrapper />', () => {
  const props = {
    getContent: jest.fn(),
    setPageLoadingTime: jest.fn(),
    cmsPages: {
      home: {
        pageName: 'Monty homepage',
        pageData: [{ type: 'iframe' }],
      },
    },
    route: {
      cmsPageName: 'home',
      isHygienePage: true,
    },
    brandName: 'topshop',
    baseUrl: 'm.topshop.com',
    location: {
      pathname: '',
    },
    params: {},
    visited: ['/', '/', '/'],
  }

  const WrappedComp = CMSWrapper.WrappedComponent
  const render = (ps) => shallow(<WrappedComp {...props} {...ps} />)

  it('updates Helmet', () => {
    const home = render(props)
    const expected = {
      defer: true,
      encodeSpecialCharacters: true,
      link: [
        {
          href: 'http://www.topshop.com',
          rel: 'canonical',
        },
      ],
      meta: [{ content: 'home', name: 'home' }],
      script: [],
      title: 'Monty homepage',
    }

    expect(home.find(Helmet).props()).toEqual(expected)
  })

  it('shows CmsNotAvailable component in case of no cms home page content', () => {
    const props = {
      getContent: jest.fn(),
      setPageLoadingTime: jest.fn(),
      cmsPages: {
        home: {
          error: 'abc',
          pageName: 'Monty homepage',
          pageData: [],
        },
      },
      route: {
        cmsPageName: 'home',
        isHygienePage: true,
      },
      brandName: 'topshop',
      baseUrl: 'm.topshop.com',
      location: {
        pathname: '',
      },
      params: {},
      visited: ['/', '/', '/'],
    }
    const component = render(props)

    expect(component.find(CmsNotAvailable).length).toBe(1)

    // It does not show anything else thant the NotFound component
    expect(component.children().length).toBe(0)
  })

  it('shows Loader if no content available', () => {
    const props = {
      getContent: jest.fn(),
      setPageLoadingTime: jest.fn(),
      cmsPages: {},
      route: {
        cmsPageName: 'home',
        isHygienePage: true,
      },
      brandName: 'topshop',
      baseUrl: 'm.topshop.com',
      location: {
        pathname: '',
      },
      params: {},
      visited: ['/', '/', '/'],
    }
    const component = render(props)

    expect(component.find(Loader).length).toBe(1)

    // It does not show anything else thant the Loader component
    expect(component.children().length).toBe(0)
  })

  it('shows TermsAndConditions component where expected', () => {
    const props = {
      getContent: jest.fn(),
      setPageLoadingTime: jest.fn(),
      cmsPages: {
        termsAndConditions: {
          pageName: 'Monty - Terms and Conditions',
          pageData: {
            pageHeading: 'Terms and Conditions',
            '1stlevel': [
              {
                heading: 'Terms & Conditions',
                '2ndlevel': [
                  {
                    subHeading: 'Terms & Conditions',
                    markup:
                      '<p>Welcome to the TOPSHOP.COM terms and conditions, which apply to all items ordered from TOPSHOP.COM. Please read through them carefully before placing your order. By using this website and/or placing an order you agree to be bound by the terms and conditions set out below. Please also read our <a href="/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd?catalogId=33057&storeId=12556&langId=-1&viewAllFlag=false&categoryId=528992&interstitial=true">Privacy Policy</a> regarding personal information provided by you.<br /><br />We may change these terms and conditions from time to time without notice to you. Changes will apply to any subsequent orders received. Once your order has been confirmed, we will not be able to make any changes to the terms that apply to that order. <br /><br />Before placing an order, if you have any queries relating to these terms and conditions, please contact our <a style="text-decoration: none" href="http://help.topshop.com/system/templates/selfservice/topshop/#!portal/1001/topic/2177/Contact-Us" target="_blank">Customer Services team.</a></p><p> </p>',
                  },
                ],
              },
            ],
          },
        },
      },
      route: {
        cmsPageName: 'termsAndConditions',
        isHygienePage: true,
      },
      brandName: 'topshop',
      baseUrl: 'm.topshop.com',
      location: {
        pathname: '',
      },
      params: {},
      visited: ['/', '/', '/'],
    }

    const component = render(props)

    expect(component.find(TermsAndConditions).length).toBe(1)
    expect(component.find(TermsAndConditions).props().tsAndCs).toEqual(
      props.cmsPages.termsAndConditions
    )
  })

  it('shows CmsForm component when expected', () => {
    const props = {
      getContent: jest.fn(),
      setPageLoadingTime: jest.fn(),
      cmsPages: {
        cmsForm: {
          pageId: 118394,
          pageName: 'mob - Style Notes',
          pageData: [{ formCss: {} }],
        },
      },
      route: {
        cmsPageName: 'cmsForm',
        isHygienePage: true,
      },
      brandName: 'topshop',
      baseUrl: 'm.topshop.com',
      location: {
        pathname: '',
      },
      params: {},
      visited: ['/', '/', '/'],
    }

    const component = render(props)

    expect(component.find(CmsForm).length).toBe(1)
    expect(component.find(CmsForm).props().formContent).toEqual(
      props.cmsPages.cmsForm.pageData[0]
    )
    expect(component.find(CmsForm).props().formName).toEqual(
      props.route.cmsPageName
    )
  })

  it('CmsNotAvailable component not displayed for espot in case of error', () => {
    const props = {
      getContent: jest.fn(),
      setPageLoadingTime: jest.fn(),
      cmsPages: {
        espot: {
          error: 'error message',
          pageId: 118394,
          pageName: 'espot',
          pageData: [],
        },
      },
      route: {
        cmsPageName: 'espot',
        isHygienePage: true,
        contentType: 'espot',
      },
      brandName: 'topshop',
      baseUrl: 'm.topshop.com',
      location: { pathname: '' },
      params: {},
      visited: ['/', '/', '/'],
    }

    const component = render(props)

    expect(component.find(CmsNotAvailable).length).toBe(0)
  })

  it('Loader never shown in case of espot', () => {
    const props = {
      getContent: jest.fn(),
      setPageLoadingTime: jest.fn(),
      cmsPages: {
        espot: {
          error: '',
          pageId: 118394,
          pageName: 'espot',
          pageData: [],
        },
      },
      route: {
        cmsPageName: 'espot',
        isHygienePage: true,
        contentType: 'espot',
      },
      brandName: 'topshop',
      baseUrl: 'm.topshop.com',
      location: { pathname: '' },
      params: {},
      visited: ['/', '/', '/'],
    }
    const component = render(props)

    expect(component.find(Loader).length).toBe(0)
  })

  it('CmsWrapper-espot classname in case of espot and no Helmet', () => {
    const props = {
      getContent: jest.fn(),
      setPageLoadingTime: jest.fn(),
      cmsPages: {
        espot: {
          error: '',
          pageId: 118394,
          pageName: 'espot',
          pageData: [
            {
              type: 'imagelist',
              data: {
                columns: 1,
                assets: [
                  {
                    target: '',
                    alt: 'Free Shipping - Find out more',
                    link:
                      '/en/tsuk/category/uk-delivery-4043283/home?TS=1421171569402&amp;intcmpid=mobile_PLP_Shipping',
                    source:
                      'http://media.topshop.com/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color7/cms/pages/json/json-0000116870/images/ESPOTS_SITEWIDE_UK.jpg',
                  },
                ],
              },
            },
          ],
        },
      },
      route: {
        cmsPageName: 'espot',
        isHygienePage: true,
        contentType: 'espot',
      },
      brandName: 'topshop',
      baseUrl: 'm.topshop.com',
      location: { pathname: '' },
      params: {},
      visited: ['/', '/', '/'],
    }
    const component = render(props)

    expect(component.find('.CmsWrapper-espot').length).toBe(1)
    expect(component.find(Helmet).length).toBe(0)
  })

  describe('mapStateToProps', () => {
    it('builds props from state', () => {
      const store = {
        subscribe: () => {},
        dispatch: () => {},
        getState: () => ({
          config: {
            assets: generatedAssets,
          },
          cms: {
            pages: {
              hygienePages: false,
            },
          },
          navigation: {
            menuLinks: [],
          },
          viewport: {
            height: 800,
          },
          routing: {
            hostname: 'm.topshop.com',
            visited: ['/'],
          },
        }),
      }
      const wrapper = shallow(<CMSWrapper store={store} />)

      expect(wrapper.first().props()).toMatchObject({
        cmsPages: {
          hygienePages: false,
        },
        baseUrl: 'm.topshop.com',
        menuLinks: [],
        viewportHeight: 800,
        visited: ['/'],
        assets: generatedAssets,
      })
    })
  })
})
