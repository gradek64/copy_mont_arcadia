import Mapper from '../../Mapper'
import transform from '../../transforms/logon'
import { authenticatedCookies } from './cookies'
import Verify from './Verify'

export default class Account extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = `/webapp/wcs/stores/servlet/LogonForm`
  }

  mapRequestParameters() {
    const { catalogId, langId, siteId: storeId } = this.storeConfig
    this.query = {
      langId,
      storeId,
      catalogId,
      new: 'Y',
      returnPage: '',
      personalizedCatalog: false,
      reLogonURL: 'LogonForm',
    }
  }

  mapResponse(res) {
    const body = this.mapResponseBody(res.body)
    return {
      jsessionid: res.jsessionid,
      body,
      setCookies: authenticatedCookies(),
    }
  }

  mapResponseBody(body) {
    if (!body || (body && !body.isLoggedIn)) {
      throw new Error('wcsSessionTimeout')
    }

    return transform(body)
  }

  execute() {
    if (this.query.email) {
      const verify = new Verify(
        this.destinationEndpoint,
        this.query,
        this.payload,
        this.method,
        this.headers
      )
      return verify.execute()
    }
    return super.execute()
  }
}

export const accountSpec = {
  summary: 'Account details for a user that has logged in',
  responses: {
    200: {
      headers: {
        'set-cookie': {
          type: 'string',
          description:
            '1. `authenticated` cookie set to `yes` when the user has successfully authenticated',
        },
      },
      description: 'Account details object',
      schema: {
        type: 'object',
        properties: {
          basketItemCount: {
            type: 'number',
            example: 3,
          },
          billingDetails: {
            type: 'object',
            properties: {
              addressDetailsId: {
                type: 'string',
                example: '789993',
              },
              nameAndPhone: {
                type: 'object',
                properties: {
                  lastName: {
                    type: 'string',
                    example: 'asdfdsaf',
                  },
                  telephone: {
                    type: 'string',
                    example: '1231231231',
                  },
                  title: {
                    type: 'string',
                    example: 'Mr',
                  },
                  firstName: {
                    type: 'string',
                    example: 'asfdds',
                  },
                },
              },
              address: {
                type: 'object',
                properties: {
                  address1: {
                    type: 'string',
                    example: '3 Essex Road',
                  },
                  address2: {
                    type: 'string',
                    example: '',
                  },
                  city: {
                    type: 'string',
                    example: 'LONDON',
                  },
                  state: {
                    type: 'string',
                    example: '',
                  },
                  country: {
                    type: 'string',
                    example: 'United Kingdom',
                  },
                  postcode: {
                    type: 'string',
                    example: 'E12 6RF',
                  },
                },
              },
            },
          },
          creditCard: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                example: 'VISA',
              },
              cardNumberHash: {
                type: 'string',
                example: 'tjOBl4zzS+ueTZQWartO5l968iOmCOix',
              },
              cardNumberStar: {
                type: 'string',
                example: '************1111',
              },
              expiryMonth: {
                type: 'string',
                example: '02',
              },
              expiryYear: {
                type: 'string',
                example: '2018',
              },
            },
          },
          deliveryDetails: {
            type: 'object',
            properties: {
              addressDetailsId: {
                type: 'number',
                example: 789993,
              },
              nameAndPhone: {
                type: 'object',
                properties: {
                  lastName: {
                    type: 'string',
                    example: 'asdfdsaf',
                  },
                  telephone: {
                    type: 'string',
                    example: '1231231231',
                  },
                  title: {
                    type: 'string',
                    example: 'Mr',
                  },
                  firstName: {
                    type: 'string',
                    example: 'asfdds',
                  },
                },
              },
              address: {
                type: 'object',
                properties: {
                  address1: {
                    type: 'string',
                    example: '3 Essex Road',
                  },
                  address2: {
                    type: 'string',
                    example: '',
                  },
                  city: {
                    type: 'string',
                    example: 'LONDON',
                  },
                  state: {
                    type: 'string',
                    example: '',
                  },
                  country: {
                    type: 'string',
                    example: 'United Kingdom',
                  },
                  postcode: {
                    type: 'string',
                    example: 'E12 6RF',
                  },
                },
              },
            },
          },
          email: {
            type: 'text',
            example: 'monty@desktop.com',
          },
          exists: {
            type: 'boolean',
            example: true,
          },
          firstName: {
            type: 'string',
            example: 'asdfdsaf',
          },
          lastName: {
            type: 'string',
            example: 'adsfdsaf',
          },
          subscriptionId: {
            type: 'number',
            example: 2051366,
          },
          title: {
            type: 'string',
            example: 'Mr',
          },
          userTrackingId: {
            type: 'number',
            example: 1221110,
          },
          expId1: {
            type: 'string',
            example:
              'ba01f790419dc0f27b69b4184943286dd0e738ff8dbf4287d138c0cb0409ba09',
            description: 'hash of email_id for exponea',
          },
          expId2: {
            type: 'string',
            example:
              '8335c4e067a04af8a4cdb3aa688379d7e3e2625e0c1e7e39e7024bf21ba7bf57',
            description: 'hash of member_id for exponea',
          },
          isDDPUser: {
            type: 'boolean',
            example: true,
            description: 'is the user currently a ddp user',
          },
          isDDPRenewable: {
            type: 'boolean',
            example: false,
            description:
              'is the user able to renew their expired or expiring ddp subscription. Becomes active when the user has 1 month remaining on their current subscription.',
          },
          ddpStartDate: {
            type: 'string',
            example: '5 July 2020',
            description: 'When did their DDP subscription start.',
          },
          ddpEndDate: {
            type: 'string',
            example: '5 July 2020',
            description: 'When will their DDP subscription end.',
          },
          wasDDPUser: {
            type: 'boolean',
            example: false,
            description: 'Has the user ever had DDP?',
          },
          ddpCurrentOrderCount: {
            type: 'number',
            example: 3,
            description:
              'How many order has the user placed during their current DDP subscription',
          },
          ddpPreviousOrderCount: {
            type: 'number',
            example: 0,
            description:
              'How many order has the user placed during their previous DDP subscription',
          },
          ddpCurrentSaving: {
            type: 'number',
            example: 12.05,
            description:
              'Approximate amount of savings accrued by the DDP User during their current DDP subscription.',
          },
          ddpPreviouSaving: {
            type: 'number',
            example: 0.0,
            description:
              'Approximate amount of savings accrued by the DDP User during their previous DDP subscription.',
          },
          ddpStandardPrice: {
            type: 'number',
            example: 5.95,
            description: 'Standard price of DDP for this brand.',
          },
          ddpExpressDeliveryPrice: {
            type: 'number',
            example: 6.0,
            description: 'Standard cost of express delivery for this brand.',
          },
        },
      },
    },
  },
}
