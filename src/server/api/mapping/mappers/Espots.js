import Mapper from '../Mapper'
import Boom from 'boom'

export default class Espots extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/EspotDetails'
  }
  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    const { items: espots } = this.query
    if (!espots || !espots.length)
      throw Boom.badRequest('No Espot names provided')
    this.query = {
      langId,
      storeId,
      catalogId,
      espots,
    }
  }
}

export const espotsSpec = {
  summary: 'Returns data for a list of requested espots',
  parameters: [
    {
      in: 'query',
      name: 'items',
      description: 'Comma separated list of espots',
      required: true,
      type: 'string',
    },
  ],
  responses: {
    200: {
      description: 'Successfully fetched the data for the espots listed',
      schema: {
        type: 'object',
        properties: {
          espots: {
            type: 'object',
            description:
              'Object with a property named after each requested espot which contains the data for that espot',
            additionalProperties: {
              type: 'object',
              properties: {
                EspotContents: {
                  type: 'object',
                  properties: {
                    cmsModileContent: {
                      type: 'object',
                      properties: {
                        pageId: {
                          type: 'number',
                          example: 90624,
                        },
                        pageName: {
                          type: 'string',
                          example: 'static-0000090624',
                        },
                        breadcrumb: {
                          type: 'string',
                          example: 'New UK Tactical Message',
                        },
                        baseline: {
                          type: 'string',
                          example: '200',
                        },
                        revision: {
                          type: 'string',
                          example: '0',
                        },
                        lastPublished: {
                          type: 'string',
                          example: '2018-05-24 17:09:20.577068',
                        },
                        contentPath: {
                          type: 'string',
                          example:
                            'cms/pages/static/static-0000090624/static-0000090624.html',
                        },
                        seoUrl: {
                          type: 'string',
                          example:
                            '/en/tsuk/category/new-uk-tactical-message-4674354/home',
                        },
                        mobileCMSUrl: {
                          type: 'string',
                          example:
                            'cms/pages/json/json-0000116708/json-0000116708.json',
                        },
                        responsiveCMSUrl: {
                          type: 'string',
                          example:
                            'cms/pages/json/json-0000116708/json-0000116708.json',
                        },
                      },
                    },
                    encodedcmsMobileContent: {
                      type: 'string',
                      example:
                        '%3C%21--+CMS+Page+Version%3A+static-0000090624+baseline%3A+200+revision%3A+0+published%3A+2018-05-24+17%3A09%3A20.577068%3AJake+Stewart+--%3E+%3C%21--+CMS+Page+Data+Start+--%3E+%3Cscript+type%3D%22text%2Fjavascript%22%3E+%2F%2F%3C%21%5BCDATA%5B+var+cmsPage90624+%3D+%7B+%22pageId%22%3A+90624%2C+%22pageName%22%3A+%22static-0000090624%22%2C+%22breadcrumb%22%3A+%22New+UK+Tactical+Message%22%2C+%22baseline%22%3A+%22200%22%2C+%22revision%22%3A+%220%22%2C+%22lastPublished%22%3A+%222018-05-24+17%3A09%3A20.577068%22%2C+%22contentPath%22%3A+%22cms%2Fpages%2Fstatic%2Fstatic-0000090624%2Fstatic-0000090624.html%22%2C+%22seoUrl%22%3A+%22%2Fen%2Ftsuk%2Fcategory%2Fnew-uk-tactical-message-4674354%2Fhome%22%2C+%22mobileCMSUrl%22%3A+%22cms%2Fpages%2Fjson%2Fjson-0000116708%2Fjson-0000116708.json%22%2C+%22responsiveCMSUrl%22%3A+%22%22+%7D+%2F%2F%5D%5D%3E+%3C%2Fscript%3E+%3C%21--+CMS+Page+Data+End+--%3E+%3C%21--+CMS+Temp+Version%3A+template-0000011130+baseline%3A+2+revision%3A+0+description%3A+Cycle+Builder+%28MASTER%29+%28REF+0000011124%29+published%3A+2013-10-09+12%3A38%3A33.676962+--%3E+%3Clink+rel%3D%22stylesheet%22+type%3D%22text%2Fcss%22+href%3D%22https%3A%2F%2Fts-tst1.tst.digital.arcadiagroup.co.uk%2Fwcsstore%2FConsumerDirectStorefrontAssetStore%2Fimages%2Fcolors%2Fcolor7%2Fcms%2Ftemplates%2Fstatic%2Ftemplate-0000011130%2Fcss%2Fdefault.css%22+%2F%3E%3Cstyle+type%3D%22text%2Fcss%22%3E+%2F*%3C%21%5BCDATA%5B*%2F+%2F*%5D%5D%3E*%2F+%3C%2Fstyle%3E+%3Cstyle+type%3D%22text%2Fcss%22%3E+%2F*%3C%21%5BCDATA%5B*%2F+%2F*%5D%5D%3E*%2F+%3C%2Fstyle%3E+%3Cdiv+id%3D%22cycleBuilder90624%22+class%3D%22cycleBuilderContent+default%22%3E+%3Cul+class%3D%27cycleItemList%27%3E+%3Cli+class%3D%27cycleItem_1%27%3E%3Ca+href%3D%22%2Fen%2Ftsuk%2Fcategory%2Fuk-delivery-4043283%2Fhome%3FTS%3D1421171569402%26amp%3Bcat2%3D2141530%26amp%3Bintcmpid%3DTACTICAL_SHIPPING%22+title%3D%22FREE+DELIVERY*+FIND+OUT+MORE+%22+target%3D%22_self%22%3EFREE+DELIVERY*+FIND+OUT+MORE%3C%2Fa%3E%3C%2Fli%3E+%3Cli+class%3D%27cycleItem_2%27%3E%3Ca+href%3D%22%2Fen%2Ftsuk%2Fcategory%2Ftopshop-students-student-discount-2316596%2Fhome%3FTS%3D1392132268317%26amp%3Bcat2%3D277560%26amp%3Bintcmpid%3DTACTICAL_STUDENT%22+title%3D%2210%25+STUDENT+DISCOUNT%21%22+target%3D%22_self%22%3E10%25+STUDENT+DISCOUNT%21%3C%2Fa%3E%3C%2Fli%3E+%3C%2Ful%3E+%3C%2Fdiv%3E%3Cscript+type%3D%27text%2Fjavascript%27+src%3D%27%2F%2Fwww.topshop.com%2Fwcsstore%2FConsumerDirectStorefrontAssetStore%2Fimages%2Fcolors%2Fcolor7%2Fjs%2Fjquery.min.1.8.3.js%27%3E+%2F%2F%3C%21%5BCDATA%5B+%2F%2F%5D%5D%3E+%3C%2Fscript%3E+%3Cscript+type%3D%27text%2Fjavascript%27+src%3D%27%2F%2Fwww.topshop.com%2Fjavascript%2F3.15.0.0%2Flib%2Fplugins%2Fjquery.cycle.core.js%27%3E+%2F%2F%3C%21%5BCDATA%5B+%2F%2F%5D%5D%3E+%3C%2Fscript%3E+%3Cscript+type%3D%27text%2Fjavascript%27%3E+%2F%2F%3C%21%5BCDATA%5B+var+%24jQuery191+%3D+jQuery.noConflict%28%29%3B+%28function%28%24%29%7B+var+cycleItemNames+%3D+%5B%27FREE+DELIVERY*+FIND+OUT+MORE+%27%2C%2710%25+STUDENT+DISCOUNT%21%27%5D%3B+var+initialSlide+%3D+0%3B+var+locationHashVal+%3D+getHashVal%28document.location.hash%29%3B+var+sliderPos+%3D+1%3B+var+cycleWrapper+%3D+%24%28%27%23cycleBuilder90624%27%29%3B+if+%28locationHashVal+%21%3D+-1%29%7B+initialSlide+%3D+locationHashVal%3B+%7D+function+getHashVal%28hash%29%7B+if+%28hash.toLowerCase%28%29.match%28%27%23slide%27%29%29+%7B+hash+%3D+hash.replace%28%2F%23slide%2Fg%2C+%27%27%29%3B+hash+%3D+parseInt%28hash%29+-+1%3B+%7D+else+%7B+hash+%3D+-1%3B+%7D+return+hash%3B+%7D+cycleWrapper+.find%28%27.cycleItemList%27%29+.cycle%28%29%3B+cycleWrapper+.find%28%27area%5Bhref*%3D%5C%27%23slide%5C%27%5D%2C+a%5Bhref*%3D%5C%27%23slide%5C%27%5D%27%29+.bind%28%27click%27%2Cfunction%28%29+%7B+var+href+%3D+%24%28this%29.attr%28%27href%27%29%3B+locationHashVal+%3D+href.substr%28href.indexOf%28%27%23%27%29%2C+href.length%29%3B+locationHashVal+%3D+getHashVal%28locationHashVal%29%3B+if+%28locationHashVal+%21%3D+-1%29%7B+%24%28%27%23cycleBuilder90624+.cycleItemList%27%29.cycle%28locationHashVal%29%3B+%7D+%7D%29%3B+%7D%29%28%24jQuery191%29%3B+%2F%2F%5D%5D%3E+%3C%2Fscript%3E+%3C%21--Using+Master+Template%3A+%2Fstatic%2Ftemplate-0000011124+--%3E+',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Invalid "items" query parameter',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 400,
          },
          error: {
            type: 'text',
            example: 'Bad request',
          },
          message: {
            type: 'text',
            example: 'No Espot names provided',
          },
        },
      },
    },
  },
}
