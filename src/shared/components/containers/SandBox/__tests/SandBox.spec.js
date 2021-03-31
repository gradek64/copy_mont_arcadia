import testComponentHelper from 'test/unit/helpers/test-component'
import SandBox from '../SandBox'
import * as utils from '../tempUtils'
import cmsUtilities from '../../../../lib/cms-utilities'
import cmsConsts from '../../../../constants/cmsConsts'
import * as sandboxActions from '../../../../actions/common/sandBoxActions'
import * as assetUtils from '../../../../../shared/lib/asset-utils'

jest.mock('../../../../lib/cms-utilities')
jest.mock('../../../../actions/common/sandBoxActions')

utils.parseCmsForm = jest.fn(() => null)

describe('<SandBox/>', () => {
  const initialProps = {
    isFinalResponsiveEspotSolution: false,
    qubitid: 'qubitid',
    visited: [],
    pages: {},
    getContent: jest.fn(),
    getSegmentedContent: jest.fn(),
    removeContent: jest.fn(),
    location: {},
    route: {},
    setContent: jest.fn(),
    setFormDefaultSchema: jest.fn(),
    mrCmsAnalytics: jest.fn(),
    setPageStatusCode: jest.fn(),
  }
  const renderComponent = testComponentHelper(SandBox.WrappedComponent)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@renders', () => {
    it('renders the <Loader /> in case of no page data available', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('renders "CMS content mocked" in case of page as object with "cmsTestMode" property set to true', () => {
      expect(
        renderComponent({
          ...initialProps,
          location: { pathname: 'pageUrl' },
          pages: { pageUrl: { cmsTestMode: true } },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('renders <CmsNotAvailable /> in case of page as object with no property initialBody', () => {
      expect(
        renderComponent({
          ...initialProps,
          location: { pathname: 'pageUrl' },
          pages: { pageUrl: {} },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should return null if content type is espot, viewport is not mobile, and isFinalResponsiveEspotSolution is false', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        contentType: 'espot',
        isMobile: false,
        isFinalResponsiveEspotSolution: false,
      })
      expect(wrapper.html()).toBeNull()
    })

    it('should return null if not isMainContent', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        contentType: 'espot',
        isMobile: false,
        isFinalResponsiveEspotSolution: true,
        isInPageContent: false,
        isResponsiveCatHeader: false,
        location: {},
      })
      expect(wrapper.html()).toBeNull()
    })

    it('renders <CmsWrapper /> in case of props associated to CMS form page', () => {
      expect(
        renderComponent({
          ...initialProps,
          location: { pathname: 'pageUrl' },
          pages: {
            pageUrl: {
              initialBody: {},
              props: {
                location: { pathname: 'abc' },
                data: {
                  pageData: [{ formCss: 'abc' }],
                },
              },
            },
          },
        }).getTree()
      ).toMatchSnapshot()

      expect(initialProps.setFormDefaultSchema).toHaveBeenCalledTimes(1)
      expect(initialProps.setContent).toHaveBeenCalledTimes(1)
    })

    it('renders <CmsFrame /> and the Sandbox-pageId DOM node', () => {
      expect(
        renderComponent({
          ...initialProps,
          location: { pathname: 'pageUrl' },
          pages: {
            pageUrl: {
              initialBody: {},
              props: {
                location: { pathname: 'abc' },
                data: { pageData: [{}] },
              },
            },
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    describe('should show content, if main content errors', () => {
      it("set status code if title contains '404'", () => {
        global.process.browser = false
        renderComponent({
          ...initialProps,
          isInPageContent: false,
          location: { pathname: 'url' },
          featureLegacyPages: true,
          isMobile: false,
          cmsPageName: 'cmsPage',
          pages: {
            cmsPage: {
              isResponsive: true,
              initialBody: '<div>Error page</div>',
              head: {
                title: '404',
              },
            },
          },
        })

        expect(initialProps.setPageStatusCode).toHaveBeenCalledWith(404)
        global.process.browser = true
      })

      it("set status code if title contains 'error'", () => {
        global.process.browser = false
        renderComponent({
          ...initialProps,
          isInPageContent: false,
          location: { pathname: 'url' },
          featureLegacyPages: true,
          isMobile: false,
          cmsPageName: 'cmsPage',
          pages: {
            cmsPage: {
              isResponsive: true,
              initialBody: '<div>Error page</div>',
              head: {
                title: 'error',
              },
            },
          },
        })

        expect(initialProps.setPageStatusCode).toHaveBeenCalledWith(404)
        global.process.browser = true
      })

      it("set status code if title contains 'Page not found'", () => {
        global.process.browser = false
        renderComponent({
          ...initialProps,
          isInPageContent: false,
          location: { pathname: 'url' },
          featureLegacyPages: true,
          isMobile: false,
          cmsPageName: 'cmsPage',
          pages: {
            cmsPage: {
              isResponsive: true,
              initialBody: '<div>Error page</div>',
              head: {
                title: 'Page not found',
              },
            },
          },
        })

        expect(initialProps.setPageStatusCode).toHaveBeenCalledWith(404)
        global.process.browser = true
      })

      it('should not set the status code client-side', () => {
        global.process.browser = true
        renderComponent({
          ...initialProps,
          isInPageContent: false,
          location: { pathname: 'url' },
          featureLegacyPages: true,
          isMobile: false,
          cmsPageName: 'cmsPage',
          pages: {
            cmsPage: {
              isResponsive: true,
              initialBody: '<div>Error page</div>',
              head: {
                title: 'Page not found',
              },
            },
          },
        })

        expect(initialProps.setPageStatusCode).not.toHaveBeenCalled()
        global.process.browser = false
      })
    })

    describe('should display nothing if in page content errors', () => {
      beforeEach(() => {})

      it("nothing if the page title contains '404'", () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isInPageContent: true,
          location: { pathname: 'url' },
          featureLegacyPages: true,
          isMobile: false,
          cmsPageName: 'cmsPage',
          pages: {
            cmsPage: {
              isResponsive: true,
              initialBody: '<div>initial body</div>',
              head: {
                title: '404',
              },
            },
          },
        })

        expect(wrapper.html()).toBeNull()
      })

      it("nothing if the page title contains 'error'", () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isInPageContent: true,
          location: { pathname: 'url' },
          featureLegacyPages: true,
          isMobile: false,
          cmsPageName: 'cmsPage',
          pages: {
            cmsPage: {
              isResponsive: true,
              initialBody: '<div>initial body</div>',
              head: {
                title: 'error',
              },
            },
          },
        })

        expect(wrapper.html()).toBeNull()
      })

      it("nothing if the page title contains 'Page not found'", () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isInPageContent: true,
          location: { pathname: 'url' },
          featureLegacyPages: true,
          isMobile: false,
          cmsPageName: 'cmsPage',
          pages: {
            cmsPage: {
              isResponsive: true,
              initialBody: '<div>initial body</div>',
              head: {
                title: 'Page not found',
              },
            },
          },
        })

        expect(wrapper.html()).toBeNull()
      })
    })

    it('responsive CMS content', () => {
      const { getTree } = renderComponent({
        ...initialProps,
        location: { pathname: 'url' },
        featureLegacyPages: true,
        isMobile: false,
        cmsPageName: 'cmsPage',
        pages: {
          cmsPage: {
            isResponsive: true,
            initialBody: '<div>initial body</div>',
          },
        },
      })

      expect(getTree()).toMatchSnapshot()
    })

    it('with mobile espot when on mobile', () => {
      const pageId = 'espotPageId'
      const { wrapper } = renderComponent({
        ...initialProps,
        contentType: cmsConsts.ESPOT_CONTENT_TYPE,
        isMobile: true,
        pages: { [pageId]: {} },
        location: { pathname: pageId },
      })

      expect(wrapper.find('.CmsFrame')).toHaveLength(1)
      expect(wrapper.find(`#Sandbox-${pageId}`)).toHaveLength(1)
    })

    it('renders QubitReact when qubitid is provided and isFinalResponsiveEspotSolution is true', () => {
      const pageId = 'espotPageId'
      expect(
        renderComponent({
          ...initialProps,
          contentType: cmsConsts.ESPOT_CONTENT_TYPE,
          isMobile: true,
          pages: { [pageId]: {} },
          location: { pathname: pageId },
          qubitid: 'id',
          isFinalResponsiveEspotSolution: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('renders default sandbox content when qubitid is not provided and isFinalResponsiveEspotSolution is false', () => {
      const pageId = 'espotPageId'
      expect(
        renderComponent({
          ...initialProps,
          contentType: cmsConsts.ESPOT_CONTENT_TYPE,
          isMobile: true,
          pages: { [pageId]: {} },
          location: { pathname: pageId },
          isFinalResponsiveEspotSolution: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with content type not espot when not on mobile', () => {
      const pageId = 'somePageId'
      const { wrapper } = renderComponent({
        ...initialProps,
        contentType: cmsConsts.PAGE_CONTENT_TYPE,
        isMobile: false,
        pages: { [pageId]: { initialBody: 'some content' } },
        location: { pathname: pageId },
      })

      expect(wrapper.find('.CmsFrame')).toHaveLength(1)
      expect(wrapper.find(`#Sandbox-${pageId}`)).toHaveLength(1)
    })

    it('should apply the sandBoxClassName to the sandbox instance', () => {
      const pageId = 'espotPageId'
      const { wrapper } = renderComponent({
        ...initialProps,
        contentType: cmsConsts.PAGE_CONTENT_TYPE,
        isMobile: false,
        pages: { [pageId]: { initialBody: 'some content' } },
        location: { pathname: pageId },
        isResponsiveEspotEnabled: true,
        sandBoxClassName: 'Espot--whatever',
      })
      expect(wrapper.find('.CmsFrame').hasClass('Espot--whatever')).toBe(true)
    })

    it('with hidden mobile espot when on desktop and responsive espots are enabled', () => {
      const pageId = 'espotPageId'
      const { wrapper } = renderComponent({
        ...initialProps,
        contentType: cmsConsts.ESPOT_CONTENT_TYPE,
        isMobile: false,
        pages: { [pageId]: {} },
        location: { pathname: pageId },
      })

      expect(wrapper.find('.CmsFrame')).toHaveLength(0)
      expect(wrapper.find(`#Sandbox-${pageId}`)).toHaveLength(0)
    })

    describe('static needs', () => {
      it('should call getContent', () => {
        const { needs } = SandBox.WrappedComponent
        const cmsPageName = 'foo'
        jest.spyOn(sandboxActions, 'getContent')
        expect(needs).toHaveLength(1)
        needs[0]({ cmsPageName })
        expect(sandboxActions.getContent).toHaveBeenCalledTimes(1)
        expect(sandboxActions.getContent).toHaveBeenCalledWith(
          { cmsPageName },
          cmsPageName
        )
      })
    })

    describe('@lifecycle', () => {
      describe('on componentDidMount', () => {
        beforeEach(() => initialProps.getContent.mockReset())

        const segmentationRequestData = {
          wcsEndpoint: '/endpoint',
          responseIdentifier: 'id1',
        }

        describe('in case of page client side rendered', () => {
          describe('if segmentationRequestData provided and device is not mobile', () => {
            it('should call getSegmentedContent once', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                visited: ['/', '/abc'],
                cmsPageName: 'name',
                segmentationRequestData,
                isMobile: false,
                lazyLoad: false,
              })
              const { instance } = renderedComponent
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
              instance.componentDidMount()
              expect(initialProps.getSegmentedContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).toHaveBeenCalledWith(
                segmentationRequestData.wcsEndpoint,
                segmentationRequestData.responseIdentifier,
                'name',
                false
              )
              expect(initialProps.getContent).not.toHaveBeenCalled()
            })
          })
          describe('if segmentationRequestData provided and device is mobile', () => {
            it('should call getContent once', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                visited: ['/', '/abc'],
                cmsPageName: 'name',
                segmentationRequestData,
                isMobile: true,
              })
              const { instance } = renderedComponent
              expect(initialProps.getContent).not.toHaveBeenCalled()
              instance.componentDidMount()
              expect(initialProps.getContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })
          })
          describe('if segmentationRequestData NOT provided', () => {
            it('should call getContent once', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                visited: ['/', '/abc'],
              })
              const { instance } = renderedComponent
              expect(initialProps.getContent).not.toHaveBeenCalled()
              instance.componentDidMount()
              expect(initialProps.getContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })
          })
        })
        describe('when shouldGetContentOnFirstLoad is true', () => {
          describe('if segmentationRequestData provided and device is not mobile', () => {
            it('should call getSegmentedContent', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                visited: ['/'],
                shouldGetContentOnFirstLoad: true,
                cmsPageName: 'name',
                segmentationRequestData,
                isMobile: false,
                lazyLoad: false,
              })
              const { instance } = renderedComponent
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
              instance.componentDidMount()
              expect(initialProps.getSegmentedContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).toHaveBeenCalledWith(
                segmentationRequestData.wcsEndpoint,
                segmentationRequestData.responseIdentifier,
                'name',
                false
              )
              expect(initialProps.getContent).not.toHaveBeenCalled()
            })
          })
          describe('if segmentationRequestData provided and device is mobile', () => {
            it('should call getContent', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                visited: ['/'],
                shouldGetContentOnFirstLoad: true,
                cmsPageName: 'name',
                segmentationRequestData,
                isMobile: true,
              })
              const { instance } = renderedComponent
              expect(initialProps.getContent).not.toHaveBeenCalled()
              instance.componentDidMount()
              expect(initialProps.getContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })
          })
          describe('if segmentationRequestData NOT provided', () => {
            it('should call getContent', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                visited: ['/'],
                shouldGetContentOnFirstLoad: true,
              })
              const { instance } = renderedComponent
              expect(initialProps.getContent).not.toHaveBeenCalled()
              instance.componentDidMount()
              expect(initialProps.getContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })
          })
        })

        it('does not call getSegmentedContent or getContent in case of page server side rendered', () => {
          const renderedComponent = renderComponent({
            ...initialProps,
            visited: ['/'],
          })
          const { instance } = renderedComponent
          expect(initialProps.getContent).not.toHaveBeenCalled()
          expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
          instance.componentDidMount()
          expect(initialProps.getContent).not.toHaveBeenCalled()
          expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
        })

        it('does not call setWindowProps in case of no content from getPage function', () => {
          const renderedComponent = renderComponent({
            ...initialProps,
            visited: ['/', '/abc'],
          })
          const { instance } = renderedComponent
          instance.setWindowProps = jest.fn()
          instance.getPage = jest.fn(() => null)
          expect(instance.setWindowProps).not.toHaveBeenCalled()
          instance.componentDidMount()
          expect(instance.setWindowProps).not.toHaveBeenCalled()
        })

        it('calls once setWindowProps in case of content from getPage function', () => {
          const renderedComponent = renderComponent({
            ...initialProps,
            visited: ['/', '/abc'],
          })
          const { instance } = renderedComponent
          instance.setWindowProps = jest.fn()
          instance.getPage = jest.fn(() => {
            return { props: 'abc' }
          })
          expect(instance.setWindowProps).not.toHaveBeenCalled()
          instance.componentDidMount()
          expect(instance.setWindowProps).toHaveBeenCalledTimes(1)
          expect(instance.setWindowProps).toHaveBeenCalledWith('abc')
        })

        it('calls cmsUtilities.mapMountedSandboxDOMNodeToBundle once', () => {
          const renderedComponent = renderComponent({
            ...initialProps,
            visited: ['/', '/abc'],
          })
          const { instance } = renderedComponent
          expect(
            cmsUtilities.mapMountedSandboxDOMNodeToBundle
          ).not.toHaveBeenCalled()
          instance.componentDidMount()
          expect(
            cmsUtilities.mapMountedSandboxDOMNodeToBundle
          ).toHaveBeenCalledTimes(1)
        })
        describe('if getSegmentationData is NOT provided', () => {
          it('calls getContent passing true as 7th argument when forceMobile prop is set to true', () => {
            const renderedComponent = renderComponent({
              ...initialProps,
              visited: ['/', '/abc'],
              forceMobile: true,
            })
            const { instance } = renderedComponent
            instance.componentDidMount()

            expect(initialProps.getContent).toHaveBeenCalledWith(
              {},
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              true,
              false
            )
          })

          it('calls getContent passing undefined as 7th argument when forceMobile prop is not set to true', () => {
            const renderedComponent = renderComponent({
              ...initialProps,
              visited: ['/', '/abc'],
            })
            const { instance } = renderedComponent

            instance.componentDidMount()

            expect(initialProps.getContent).toHaveBeenCalledWith(
              {},
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              false,
              false
            )
          })
        })

        describe('CSS deferring', () => {
          beforeEach(jest.resetAllMocks)
          afterAll(jest.restoreAllMocks)

          const headLinks = [
            {
              rel: 'mocked-rel',
              href: 'mocked-url',
            },
            {
              rel: 'mocked-rel-2',
              href: 'mocked-url-2',
            },
          ]
          const deferedStylesMock = [
            {
              rel: 'mocked-rel',
              href: 'mocked-url',
              media: 'defer-load',
              'data-breakpoint': '(min-width: 768px)',
            },
            {
              rel: 'mocked-rel-2',
              href: 'mocked-url-2',
              media: 'defer-load',
              'data-breakpoint': '(min-width: 992px)',
            },
          ]
          const pages = {
            home: {
              initialBody: 'mock',
              head: { link: headLinks },
            },
          }

          describe('client side rendering', () => {
            it('should not defer CSS links', () => {
              const deferStylesSpy = jest.spyOn(assetUtils, 'deferStyles')
              renderComponent(initialProps)
              expect(deferStylesSpy).toHaveBeenCalledTimes(0)
            })

            it('should make sure all deferred CSS links are activated', () => {
              global.process.browser = true

              const activateDeferredStylesSpy = jest.spyOn(
                assetUtils,
                'activateDeferredStyles'
              )
              const link = pages.home.head.link

              renderComponent({
                ...initialProps,
                cmsPageName: 'home',
                pages,
              })
              expect(activateDeferredStylesSpy).toHaveBeenCalledTimes(1)
              expect(activateDeferredStylesSpy).toHaveBeenCalledWith(link)

              global.process.browser = false
            })
          })

          describe('server side rendering', () => {
            it('should not defer CSS links when client side rendering', () => {
              const deferStylesSpy = jest.spyOn(assetUtils, 'deferStyles')
              renderComponent(initialProps)
              expect(deferStylesSpy).toHaveBeenCalledTimes(0)
            })

            it('should defer CSS links when server side rendering', () => {
              const deferStylesSpy = jest.spyOn(assetUtils, 'deferStyles')
              deferStylesSpy.mockImplementation(() => deferedStylesMock)
              renderComponent({
                ...initialProps,
                cmsPageName: 'home',
                pages,
              })

              expect(deferStylesSpy).toHaveBeenCalledTimes(1)
              expect(deferStylesSpy).toHaveBeenCalledWith(
                headLinks.map((l) => ({
                  ...l,
                  media: 'all',
                  'data-breakpoint': 'all',
                }))
              )
            })
          })
        })
      })

      describe('on UNSAFE_componentWillReceiveProps', () => {
        beforeEach(() => initialProps.getContent.mockReset())
        beforeEach(() => initialProps.removeContent.mockReset())

        const segmentationRequestData = {
          wcsEndpoint: '/endpoint',
          responseIdentifier: 'id1',
        }

        describe('when location has changed', () => {
          it('should call unmountPreviousSandboxDOMNode from cmsUtilities and removeContent', () => {
            const renderedComponent = renderComponent({
              ...initialProps,
              cmsPageName: 'name',
            })
            const { wrapper } = renderedComponent
            expect(
              cmsUtilities.unmountPreviousSandboxDOMNode
            ).not.toHaveBeenCalled()
            expect(initialProps.removeContent).not.toHaveBeenCalled()
            expect(initialProps.getContent).not.toHaveBeenCalled()
            wrapper.setProps({ location: { pathname: 'abc' } })
            expect(
              cmsUtilities.unmountPreviousSandboxDOMNode
            ).toHaveBeenCalledTimes(1)
            expect(initialProps.removeContent).toHaveBeenCalledTimes(1)
            expect(initialProps.removeContent).toHaveBeenCalledWith('name')
          })

          describe('if segmentationRequestData is provided and device is not mobile', () => {
            it('should call getSegmentedContent', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                segmentationRequestData,
                cmsPageName: 'name',
                isMobile: false,
                lazyLoad: false,
              })
              const { wrapper } = renderedComponent
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
              wrapper.setProps({ location: { pathname: 'abc' } })
              expect(initialProps.getSegmentedContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).toHaveBeenCalledWith(
                segmentationRequestData.wcsEndpoint,
                segmentationRequestData.responseIdentifier,
                'name',
                false
              )
              expect(initialProps.getContent).not.toHaveBeenCalled()
            })
          })

          describe('if segmentationRequestData is provided and device is mobile', () => {
            const { wrapper } = renderComponent({
              ...initialProps,
              segmentationRequestData,
              cmsPageName: 'name',
              isMobile: true,
            })
            expect(initialProps.getContent).not.toHaveBeenCalled()
            wrapper.setProps({ location: { pathname: 'abc' } })
            expect(initialProps.getContent).toHaveBeenCalledTimes(1)
            expect(initialProps.getContent).toHaveBeenCalledWith(
              { pathname: 'abc' },
              'name',
              undefined,
              undefined,
              undefined,
              undefined,
              false,
              false
            )
            expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
          })

          describe('if segmentationRequestData is NOT provided', () => {
            it('should call getContent', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                cmsPageName: 'name',
              })
              const { wrapper } = renderedComponent
              expect(initialProps.getContent).not.toHaveBeenCalled()
              wrapper.setProps({ location: { pathname: 'abc' } })
              expect(initialProps.getContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getContent).toHaveBeenCalledWith(
                { pathname: 'abc' },
                'name',
                undefined,
                undefined,
                undefined,
                undefined,
                false,
                false
              )
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })
          })
        })
        describe('when page name changes', () => {
          it('should call unmountPreviousSandboxDOMNode from cmsUtilities and removeContent', () => {
            const renderedComponent = renderComponent({
              ...initialProps,
              cmsPageName: 'name',
            })
            const { wrapper } = renderedComponent
            expect(
              cmsUtilities.unmountPreviousSandboxDOMNode
            ).not.toHaveBeenCalled()
            expect(initialProps.removeContent).not.toHaveBeenCalled()
            expect(initialProps.getContent).not.toHaveBeenCalled()
            wrapper.setProps({ location: {}, cmsPageName: 'abc' })
            expect(
              cmsUtilities.unmountPreviousSandboxDOMNode
            ).toHaveBeenCalledTimes(1)
            expect(initialProps.removeContent).toHaveBeenCalledTimes(1)
            expect(initialProps.removeContent).toHaveBeenCalledWith('name')
          })
          describe('if segmentationRequestData is provided', () => {
            it('should call getSegmentedContent with new page name', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                segmentationRequestData,
                cmsPageName: 'name',
                lazyLoad: true,
              })
              const { wrapper } = renderedComponent
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
              wrapper.setProps({ location: {}, cmsPageName: 'abc' })
              expect(initialProps.getSegmentedContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).toHaveBeenCalledWith(
                segmentationRequestData.wcsEndpoint,
                segmentationRequestData.responseIdentifier,
                'abc',
                true
              )
              expect(initialProps.getContent).not.toHaveBeenCalled()
            })
          })
          describe('if segmentationRequestData is NOT provided', () => {
            it('should call getContent with new page name', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                cmsPageName: 'name',
              })
              const { wrapper } = renderedComponent
              expect(initialProps.getContent).not.toHaveBeenCalled()
              wrapper.setProps({ location: {}, cmsPageName: 'abc' })
              expect(initialProps.getContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getContent).toHaveBeenCalledWith(
                {},
                'abc',
                undefined,
                undefined,
                undefined,
                undefined,
                false,
                false
              )
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })
          })
        })

        it('no id - does not call unmountPreviousSandboxDOMNode, removeContent', () => {
          const renderedComponent = renderComponent(initialProps)
          const { wrapper } = renderedComponent
          expect(
            cmsUtilities.unmountPreviousSandboxDOMNode
          ).not.toHaveBeenCalled()
          expect(initialProps.removeContent).not.toHaveBeenCalled()
          expect(initialProps.getContent).not.toHaveBeenCalled()
          wrapper.setProps({ location: {}, cmsPageName: 'abc' })
          expect(
            cmsUtilities.unmountPreviousSandboxDOMNode
          ).not.toHaveBeenCalled()
          expect(initialProps.removeContent).not.toHaveBeenCalled()
          expect(initialProps.getContent).toHaveBeenCalledTimes(1)
          expect(initialProps.getContent).toHaveBeenCalledWith(
            {},
            'abc',
            undefined,
            undefined,
            undefined,
            undefined,
            false,
            false
          )
        })
        describe('when location and page name stay the same', () => {
          describe('if segmentationRequestData provided', () => {
            it('should not call unmountPreviousSandboxDOMNode, removeContent, or getSegmentedContent', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                segmentationRequestData,
              })
              const { wrapper } = renderedComponent
              expect(
                cmsUtilities.unmountPreviousSandboxDOMNode
              ).not.toHaveBeenCalled()
              expect(initialProps.removeContent).not.toHaveBeenCalled()
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
              wrapper.setProps({ pages: { abc: 'def' } })
              expect(
                cmsUtilities.unmountPreviousSandboxDOMNode
              ).not.toHaveBeenCalled()
              expect(initialProps.removeContent).not.toHaveBeenCalled()
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })
          })
          describe('if segmentationRequestData NOT provided', () => {
            it('should not call unmountPreviousSandboxDOMNode, removeContent, or getContent', () => {
              const renderedComponent = renderComponent({ ...initialProps })
              const { wrapper } = renderedComponent
              expect(
                cmsUtilities.unmountPreviousSandboxDOMNode
              ).not.toHaveBeenCalled()
              expect(initialProps.removeContent).not.toHaveBeenCalled()
              expect(initialProps.getContent).not.toHaveBeenCalled()
              wrapper.setProps({ pages: { abc: 'def' } })
              expect(
                cmsUtilities.unmountPreviousSandboxDOMNode
              ).not.toHaveBeenCalled()
              expect(initialProps.removeContent).not.toHaveBeenCalled()
              expect(initialProps.getContent).not.toHaveBeenCalled()
            })
          })
        })

        it('calls setWindowProps in case of changed page content', () => {
          const renderedComponent = renderComponent({
            ...initialProps,
            location: { pathname: 'abc' },
          })
          const { wrapper, instance } = renderedComponent
          instance.setWindowProps = jest.fn()
          expect(instance.setWindowProps).not.toHaveBeenCalled()
          wrapper.setProps({
            location: { pathname: 'abc' },
            pages: { abc: 'def' },
          })
          expect(instance.setWindowProps).toHaveBeenCalledTimes(1)
        })

        describe('when viewport deviceType did not change', () => {
          describe('if segmentationRequestData provided', () => {
            it('should not call getSegmentedContent', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                segmentationRequestData,
                isMobile: false,
              })
              const { wrapper } = renderedComponent

              wrapper.setProps({ isMobile: false })

              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })
          })
          describe('segmentationRequestData NOT provided', () => {
            it('should not call getContent', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                isMobile: false,
              })
              const { wrapper } = renderedComponent

              wrapper.setProps({ isMobile: false })

              expect(initialProps.getContent).not.toHaveBeenCalled()
            })
          })
        })

        describe('when viewport deviceType is changed', () => {
          describe('if segmentationRequestData is provided', () => {
            it('should call getContent if new deviceType is mobile', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                segmentationRequestData,
                isMobile: false,
              })
              const { wrapper } = renderedComponent

              expect(initialProps.getContent).not.toHaveBeenCalled()

              wrapper.setProps({ isMobile: true })

              expect(initialProps.getContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })

            it('should call getSegmentedContent if new deviceType is not mobile', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                isMobile: true,
              })
              const { wrapper } = renderedComponent

              expect(initialProps.getContent).not.toHaveBeenCalled()

              wrapper.setProps({ isMobile: false })

              expect(initialProps.getContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })
          })

          describe('if segmentationRequestData is NOT provided', () => {
            it('should call getContent', () => {
              const renderedComponent = renderComponent({
                ...initialProps,
                isMobile: false,
              })
              const { wrapper } = renderedComponent

              expect(initialProps.getContent).not.toHaveBeenCalled()

              wrapper.setProps({ isMobile: true })

              expect(initialProps.getContent).toHaveBeenCalledTimes(1)
              expect(initialProps.getSegmentedContent).not.toHaveBeenCalled()
            })
          })
        })

        it('calls getContent providing true as 7th argument when next props contains forceMobile=true', () => {
          const { wrapper } = renderComponent(initialProps)

          wrapper.setProps({
            location: {},
            cmsPageName: 'abc',
            forceMobile: true,
          })

          expect(initialProps.getContent).toHaveBeenCalledWith(
            {},
            'abc',
            undefined,
            undefined,
            undefined,
            undefined,
            true,
            false
          )
        })

        it('calls getContent providing undefined as 7th argument when next props does not contains forceMobile', () => {
          const { wrapper } = renderComponent(initialProps)

          wrapper.setProps({ location: {}, cmsPageName: 'abc' })

          expect(initialProps.getContent).toHaveBeenCalledWith(
            {},
            'abc',
            undefined,
            undefined,
            undefined,
            undefined,
            false,
            false
          )
        })
      })

      describe('on componentDidUpdate', () => {
        it('calls cmsUtilities.mapMountedSandboxDOMNodeToBundle once', () => {
          const renderedComponent = renderComponent({
            ...initialProps,
            visited: ['/', '/abc'],
          })
          const { instance } = renderedComponent
          expect(
            cmsUtilities.mapMountedSandboxDOMNodeToBundle
          ).not.toHaveBeenCalled()
          instance.componentDidUpdate()
          expect(
            cmsUtilities.mapMountedSandboxDOMNodeToBundle
          ).toHaveBeenCalledTimes(1)
        })
      })

      describe('on componentWillUnmount', () => {
        it('calls once unmountPreviousSandboxDOMNode', () => {
          cmsUtilities.unmountPreviousSandboxDOMNode = jest.fn()
          expect(
            cmsUtilities.unmountPreviousSandboxDOMNode
          ).not.toHaveBeenCalled()
          const renderedComponent = renderComponent({ ...initialProps })
          const { instance } = renderedComponent
          instance.componentWillUnmount()
          expect(
            cmsUtilities.unmountPreviousSandboxDOMNode
          ).toHaveBeenCalledTimes(1)
        })

        it('calls once this.props.removeContent', () => {
          const spyOnremoveContent = jest.fn()
          const { instance } = renderComponent({
            ...initialProps,
            removeContent: spyOnremoveContent,
          })
          expect(spyOnremoveContent).not.toHaveBeenCalled()
          instance.componentWillUnmount()
          expect(spyOnremoveContent).toHaveBeenCalledTimes(1)
        })
      })

      describe('getPage', () => {
        it('should return null if empty object is passed to getPage', () => {
          const { instance } = renderComponent(initialProps)
          expect(instance.getPage({})).toBeNull()
        })

        it('should return page id if found by getPage', () => {
          const { instance } = renderComponent(initialProps)
          const pageId = 'page id'
          jest.spyOn(instance, 'getID').mockReturnValue(pageId)
          expect(
            instance.getPage({
              pages: {
                [pageId]: pageId,
              },
            })
          ).toBe(pageId)
        })
      })

      // TODO
      // - test setWindowProps
      // - test getCmsPageName
    })

    describe('@instance methods', () => {
      describe('deferredNotifyContentLoaded', () => {
        const onContentLoaded = jest.fn()

        beforeEach(() => jest.clearAllMocks())

        it('does not fail if callback not provided', () => {
          const { instance } = renderComponent({
            ...initialProps,
          })
          instance.deferredNotifyContentLoaded()
        })

        it('does not fail if sandboxRef not set', () => {
          const { instance } = renderComponent({
            ...initialProps,
            onContentLoaded,
          })
          expect(onContentLoaded).not.toHaveBeenCalled()
          instance.deferredNotifyContentLoaded()
          expect(onContentLoaded).not.toHaveBeenCalled()
        })

        it('does not call callback if sandboxRef does not have a firstChildElement', () => {
          const { instance } = renderComponent({
            ...initialProps,
            onContentLoaded,
          })
          instance.sandboxRef = {}
          expect(onContentLoaded).not.toHaveBeenCalled()
          instance.deferredNotifyContentLoaded()
          expect(onContentLoaded).not.toHaveBeenCalled()
        })

        it("does not call callback if sandboxRef's firstChildElement does not have height", () => {
          const { instance } = renderComponent({
            ...initialProps,
            onContentLoaded,
          })
          instance.sandboxRef = {
            firstElementChild: {
              clientHeight: 0,
            },
          }
          expect(onContentLoaded).not.toHaveBeenCalled()
          instance.deferredNotifyContentLoaded()
          expect(onContentLoaded).not.toHaveBeenCalled()
        })

        it("invokes callback if sandboxRef's firstChildElement does have height", () => {
          const { instance } = renderComponent({
            ...initialProps,
            onContentLoaded,
          })
          instance.sandboxRef = {
            firstElementChild: {
              clientHeight: 1,
            },
          }
          expect(onContentLoaded).not.toHaveBeenCalled()
          instance.deferredNotifyContentLoaded()
          expect(onContentLoaded).toHaveBeenCalled()
        })
      })
    })

    describe('LazyLoad', () => {
      it('Should call getContent with false if lazyLoad prop is false', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          lazyLoad: false,
        })

        wrapper.setProps({
          location: {},
          cmsPageName: 'abc',
          forceMobile: true,
        })

        expect(initialProps.getContent).toHaveBeenCalledWith(
          {},
          'abc',
          undefined,
          undefined,
          undefined,
          undefined,
          true,
          false
        )
      })
      it('Should call getContent with true if lazyLoad prop is true', () => {
        const { wrapper } = renderComponent({ ...initialProps, lazyLoad: true })

        wrapper.setProps({
          location: {},
          cmsPageName: 'abc',
          forceMobile: true,
        })

        expect(initialProps.getContent).toHaveBeenCalledWith(
          {},
          'abc',
          undefined,
          undefined,
          undefined,
          undefined,
          true,
          true
        )
      })
    })
  })
})
