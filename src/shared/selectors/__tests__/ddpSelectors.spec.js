import {
  getDDPProductName,
  isDDPUser,
  isDDPRenewable,
  isDDPOrder,
  isDDPOrderCompleted,
  isDDPStandaloneOrder,
  isDDPStandaloneOrderCompleted,
  isDDPPromotionEnabled,
  isDDPUserInPreExpiryWindow,
  isDDPRenewablePostWindow,
  isDDPActiveUserPreRenewWindow,
  isCurrentOrRecentDDPSubscriber,
  getDDPDefaultName,
  isOrderDDPEligible,
  isDDPActiveBannerEnabled,
  getDDPProps,
  ddpStartDate,
  ddpEndDate,
  wasDDPUser,
  ddpCurrentOrderCount,
  ddpPreviousOrderCount,
  ddpCurrentSaving,
  ddpPreviousSaving,
  ddpStandardPrice,
  ddpExpressDeliveryPrice,
  userHasNeverHadDDP,
  ddpSavingsValue,
  showDDPSavings,
  ddpRenewalEnabled,
  userCanRenewDDP,
  isRenewingDDP,
  showDDPRenewal,
  hasDDPExpired,
  ddpLogoSrc,
  hasDDPExpiredAndIsDDPRenewalDisabled,
  showDDPPromo,
  ddpAddedLogoSrc,
  showActiveDDP,
  ddpActiveLogoSrc,
  getDDPUserAnalyticsProperties,
  showDDPRenewalWithinDefaultExpiringBoundaries,
} from '../ddpSelectors'

describe('DDP selectors', () => {
  describe('getDDPProductName', () => {
    it('should return the DDP Default Name', () => {
      expect(
        getDDPDefaultName({
          siteOptions: {
            ddp: {
              ddpProduct: {
                name: 'Topshop Unlimited',
              },
            },
          },
        })
      ).toBe('Topshop Unlimited')
    })
    it('should return the string `DDP Subscription` if the DDP Default name is missing', () => {
      expect(
        getDDPDefaultName({
          siteOptions: {
            ddp: {
              ddpProduct: {
                name: '',
              },
            },
          },
        })
      ).toBe('DDP Subscription')
    })
    it('should return the string `DDP Subscription` if the ddp object is missing from siteOptions', () => {
      expect(
        getDDPDefaultName({
          siteOptions: {},
        })
      ).toBe('DDP Subscription')
    })
    it('should return default DDP Sku name from state', () => {
      expect(
        getDDPProductName({
          siteOptions: {
            ddp: {
              ddpProduct: {
                ddpSkus: [
                  {
                    default: true,
                    name: 'Topshop Unlimited',
                  },
                ],
              },
            },
          },
        })
      ).toBe('Topshop Unlimited')
    })
    it('should return DDP Subscription string if DDP sku has no name', () => {
      expect(
        getDDPProductName({
          siteOptions: {
            ddp: {
              ddpProduct: {
                ddpSkus: [
                  {
                    default: true,
                    name: '',
                  },
                ],
              },
            },
          },
        })
      ).toBe('DDP Subscription')
    })
    it('should return DDP Subscription string if nothing is passed in', () => {
      expect(getDDPProductName({})).toBe('DDP Subscription')
    })
  })

  describe('ddpLogoSrc', () => {
    const setBrandName = (brandName) => ({
      config: {
        brandName,
      },
    })
    it('should return /assets/{brandname}/images/ddp-icon.svg for all brands', () => {
      const missSState = setBrandName('missselfridge')
      expect(ddpLogoSrc(missSState)).toBe(
        '/assets/missselfridge/images/ddp-icon.svg'
      )
      const burtonState = setBrandName('burton')
      expect(ddpLogoSrc(burtonState)).toBe('/assets/burton/images/ddp-icon.svg')
      const dpState = setBrandName('dorothyperkins')
      expect(ddpLogoSrc(dpState)).toBe(
        '/assets/dorothyperkins/images/ddp-icon.svg'
      )
      const topshopState = setBrandName('topshop')
      expect(ddpLogoSrc(topshopState)).toBe(
        '/assets/topshop/images/ddp-icon.svg'
      )
      const topmanState = setBrandName('topman')
      expect(ddpLogoSrc(topmanState)).toBe('/assets/topman/images/ddp-icon.svg')
      const wallisState = setBrandName('wallis')
      expect(ddpLogoSrc(wallisState)).toBe('/assets/wallis/images/ddp-icon.svg')
      const evansState = setBrandName('evans')
      expect(ddpLogoSrc(evansState)).toBe('/assets/evans/images/ddp-icon.svg')
    })
  })

  describe('ddpAddedLogoSrc', () => {
    const setBrandName = (brandName) => ({
      config: {
        brandName,
      },
    })
    it('should return /assets/{brandname}/images/ddp-added.gif for all brands', () => {
      const missSState = setBrandName('missselfridge')
      expect(ddpAddedLogoSrc(missSState)).toBe(
        '/assets/missselfridge/images/ddp-added.gif'
      )
      const burtonState = setBrandName('burton')
      expect(ddpAddedLogoSrc(burtonState)).toBe(
        '/assets/burton/images/ddp-added.gif'
      )
      const dpState = setBrandName('dorothyperkins')
      expect(ddpAddedLogoSrc(dpState)).toBe(
        '/assets/dorothyperkins/images/ddp-added.gif'
      )
      const topshopState = setBrandName('topshop')
      expect(ddpAddedLogoSrc(topshopState)).toBe(
        '/assets/topshop/images/ddp-added.gif'
      )
      const topmanState = setBrandName('topman')
      expect(ddpAddedLogoSrc(topmanState)).toBe(
        '/assets/topman/images/ddp-added.gif'
      )
      const wallisState = setBrandName('wallis')
      expect(ddpAddedLogoSrc(wallisState)).toBe(
        '/assets/wallis/images/ddp-added.gif'
      )
      const evansState = setBrandName('evans')
      expect(ddpAddedLogoSrc(evansState)).toBe(
        '/assets/evans/images/ddp-added.gif'
      )
    })
  })

  describe('ddpActiveLogoSrc', () => {
    const setBrandName = (brandName) => ({
      config: {
        brandName,
      },
    })
    it('should return /assets/{brandname}/images/ddp-icon-white.svg for burton, missselfridge and dp', () => {
      const missSState = setBrandName('missselfridge')
      expect(ddpActiveLogoSrc(missSState)).toBe(
        '/assets/missselfridge/images/ddp-icon-white.svg'
      )
      const burtonState = setBrandName('burton')
      expect(ddpActiveLogoSrc(burtonState)).toBe(
        '/assets/burton/images/ddp-icon-white.svg'
      )
      const dpState = setBrandName('dorothyperkins')
      expect(ddpActiveLogoSrc(dpState)).toBe(
        '/assets/dorothyperkins/images/ddp-icon-white.svg'
      )
    })
    it('should return /assets/{brandname}/images/ddp-icon.svg for all other brands', () => {
      const topshopState = setBrandName('topshop')
      expect(ddpActiveLogoSrc(topshopState)).toBe(
        '/assets/topshop/images/ddp-icon.svg'
      )
      const topmanState = setBrandName('topman')
      expect(ddpActiveLogoSrc(topmanState)).toBe(
        '/assets/topman/images/ddp-icon.svg'
      )
      const wallisState = setBrandName('wallis')
      expect(ddpActiveLogoSrc(wallisState)).toBe(
        '/assets/wallis/images/ddp-icon.svg'
      )
      const evansState = setBrandName('evans')
      expect(ddpActiveLogoSrc(evansState)).toBe(
        '/assets/evans/images/ddp-icon.svg'
      )
    })
  })

  describe('getDDPProps', () => {
    it('should return all ddp props that can be found on the user object', () => {
      const ddpState = {
        isDDPUser: true,
        ddpEndDate: true,
        isDDPRenewable: true,
        ddpStartDate: true,
        wasDDPUser: true,
        ddpCurrentOrderCount: true,
        ddpPreviousOrderCount: true,
        ddpCurrentSaving: true,
        ddpPreviousSaving: true,
        ddpStandardPrice: true,
        ddpExpressDeliveryPrice: true,
      }
      expect(
        getDDPProps({
          account: {
            user: {
              ...ddpState,
            },
          },
        })
      ).toEqual(ddpState)
    })
    it('should return null for any props that are missing from user object', () => {
      const ddpState = {
        isDDPUser: true,
        ddpEndDate: true,
        isDDPRenewable: true,
        ddpStartDate: true,
        wasDDPUser: true,
      }
      expect(
        getDDPProps({
          account: {
            user: {
              ...ddpState,
              ddpCurrentOrderCount: null,
              ddpPreviousOrderCount: null,
              ddpCurrentSaving: null,
              ddpPreviousSaving: null,
              ddpStandardPrice: null,
              ddpExpressDeliveryPrice: null,
            },
          },
        })
      )
    })
  })

  const enabledFeatureRenewal = {
    features: {
      status: {
        FEATURE_DDP: true,
        FEATURE_IS_DDP_RENEWABLE: true,
      },
    },
  }
  const disabledFeatureDDP = {
    features: {
      status: {
        FEATURE_DDP: false,
        FEATURE_IS_DDP_RENEWABLE: true,
      },
    },
  }

  const disabledFeatureRenewal = {
    features: {
      status: {
        FEATURE_DDP: true,
        FEATURE_IS_DDP_RENEWABLE: false,
      },
    },
  }
  const shoppingBagWithDDP = {
    shoppingBag: {
      bag: {
        products: [{ isDDPProduct: true }],
      },
    },
  }

  describe('Simple Selectors', () => {
    const exampleDDPState = {
      isDDPUser: true,
      isDDPRenewable: true,
      ddpStartDate: '07 April 2020',
      ddpEndDate: '07 April 2021',
      wasDDPUser: true,
      ddpCurrentOrderCount: 5,
      ddpPreviousOrderCount: 2,
      ddpCurrentSaving: '20.05',
      ddpPreviousSaving: '2.05',
      ddpStandardPrice: '9.95',
      ddpExpressDeliveryPrice: '6.00',
    }

    const ddpSimpleSelectors = {
      isDDPUser,
      isDDPRenewable,
      ddpStartDate,
      ddpEndDate,
      wasDDPUser,
      ddpCurrentOrderCount,
      ddpPreviousOrderCount,
      ddpCurrentSaving,
      ddpPreviousSaving,
      ddpStandardPrice,
      ddpExpressDeliveryPrice,
    }

    Object.keys(ddpSimpleSelectors).forEach((key) => {
      const value = exampleDDPState[key]
      const selector = ddpSimpleSelectors[key]
      describe(`${key}`, () => {
        it(`should return ${key}'s value of '${value}'  when value exists in the state`, () => {
          expect(
            selector({
              account: {
                user: {
                  [key]: value,
                },
              },
            })
          ).toEqual(value)
        })

        it(`should return undefined when value doesn't exist in the state`, () => {
          expect(selector({})).toBeUndefined()
        })
      })
    })
  })

  describe('Combined Selectors', () => {
    describe('isDDPUserInPreExpiryWindow', () => {
      it('should return true if isDDPUser status is true and the user is in Pre Expiry Window', () => {
        expect(
          isDDPUserInPreExpiryWindow({
            account: {
              user: {
                isDDPUser: true,
                isDDPRenewable: true,
              },
            },
          })
        ).toEqual(true)
      })

      it('should return false if isDDPUser status is false and the user is in Pre Expiry Window', () => {
        expect(
          isDDPUserInPreExpiryWindow({
            account: {
              user: {
                isDDPUser: false,
                isDDPRenewable: true,
              },
            },
          })
        ).toEqual(false)
      })

      it('should return false if isDDPUser status is true and the user is not in Pre Expiry Window', () => {
        expect(
          isDDPUserInPreExpiryWindow({
            account: {
              user: {
                isDDPUser: true,
                isDDPRenewable: false,
              },
            },
          })
        ).toEqual(false)
      })

      it('should return false if isDDPUser status is true and the user is not in Pre Expiry Window', () => {
        expect(
          isDDPUserInPreExpiryWindow({
            account: {
              user: {
                isDDPUser: true,
                isDDPRenewable: false,
              },
            },
          })
        ).toBe(false)
      })
    })

    describe('isDDPRenewablePostWindow', () => {
      it('should return true if isDDPUser status is false and the user is in the Post Expiry Window', () => {
        expect(
          isDDPRenewablePostWindow({
            account: {
              user: {
                isDDPUser: false,
                isDDPRenewable: true,
              },
            },
          })
        ).toEqual(true)
      })

      it('should return false if isDDPUser status is true and the user is in the Post Expiry Window', () => {
        expect(
          isDDPRenewablePostWindow({
            account: {
              user: {
                isDDPUser: true,
                isDDPRenewable: true,
              },
            },
          })
        ).toEqual(false)
      })

      it('should return false if isDDPUser status is false and the user is not in the Post Expiry Window', () => {
        expect(
          isDDPRenewablePostWindow({
            account: {
              user: {
                isDDPUser: false,
                isDDPRenewable: false,
              },
            },
          })
        ).toEqual(false)
      })

      it('should return false if isDDPUser status is true and the user is not in the Post Expiry Window', () => {
        expect(
          isDDPRenewablePostWindow({
            account: {
              user: {
                isDDPUser: true,
                isDDPRenewable: false,
              },
            },
          })
        ).toBe(false)
      })
    })

    describe('hasDDPExpired', () => {
      it('should return true is wasDDPUser is true and isDDPUser is false', () => {
        expect(
          hasDDPExpired({
            account: {
              user: {
                isDDPUser: false,
                wasDDPUser: true,
              },
            },
          })
        ).toBe(true)
      })
      it('should return false if isDDPUser is true', () => {
        expect(
          hasDDPExpired({
            account: {
              user: {
                isDDPUser: true,
              },
            },
          })
        ).toBe(false)
      })
      it('should return false if isDDPUser is false and wasDDPUser is false', () => {
        expect(
          hasDDPExpired({
            account: {
              user: {
                isDDPUser: false,
                wasDDPUser: false,
              },
            },
          })
        ).toBe(false)
      })
    })

    describe('hasDDPExpiredAndIsDDPRenewalDisabled', () => {
      it('should return true ddp has expired and FEATURE_IS_DDP_RENEWABLE is false', () => {
        expect(
          hasDDPExpiredAndIsDDPRenewalDisabled({
            ...disabledFeatureRenewal,
            account: {
              user: {
                isDDPUser: false,
                wasDDPUser: true,
              },
            },
          })
        ).toBe(true)
      })
      it('should return false if ddp has expired and FEATURE_IS_DDP_RENEWABLE is true', () => {
        expect(
          hasDDPExpiredAndIsDDPRenewalDisabled({
            ...enabledFeatureRenewal,
            account: {
              user: {
                isDDPUser: false,
                wasDDPUser: true,
              },
            },
          })
        ).toBe(false)
      })
      it("should return false if ddp hasn't expired and FEATURE_IS_DDP_RENEWABLE is false", () => {
        expect(
          hasDDPExpiredAndIsDDPRenewalDisabled({
            ...disabledFeatureRenewal,
            account: {
              user: {
                isDDPUser: true,
                wasDDPUser: false,
              },
            },
          })
        ).toBe(false)
      })
    })

    describe('isDDPActiveUserPreRenewWindow', () => {
      it('should return true if isDDPUser status is true and the user is not in the Renewal Window', () => {
        expect(
          isDDPActiveUserPreRenewWindow({
            account: {
              user: {
                isDDPUser: true,
                isDDPRenewable: false,
              },
            },
          })
        ).toEqual(true)
      })

      it('should return false if isDDPUser status is false and the user is not in the Renewal Window', () => {
        expect(
          isDDPActiveUserPreRenewWindow({
            account: {
              user: {
                isDDPUser: false,
                isDDPRenewable: false,
              },
            },
          })
        ).toEqual(false)
      })

      it('should return false if isDDPUser status is true and the user is in the Renewal Window', () => {
        expect(
          isDDPActiveUserPreRenewWindow({
            account: {
              user: {
                isDDPUser: true,
                isDDPRenewable: true,
              },
            },
          })
        ).toEqual(false)
      })

      it('should return false if isDDPUser status is false and the user is in the Renewal Window', () => {
        expect(
          isDDPActiveUserPreRenewWindow({
            account: {
              user: {
                isDDPUser: false,
                isDDPRenewable: true,
              },
            },
          })
        ).toBe(false)
      })
    })

    describe('userHasNeverHadDDP', () => {
      it('should return true if wasDDPUser is false and isDDPUser is false', () => {
        expect(
          userHasNeverHadDDP({
            account: {
              user: {
                isDDPUser: false,
                wasDDPUser: false,
              },
            },
          })
        ).toBe(true)
      })
      it('should return false if wasDDPUser is true', () => {
        expect(
          userHasNeverHadDDP({
            account: {
              user: {
                isDDPUser: false,
                wasDDPUser: true,
              },
            },
          })
        ).toBe(false)
      })
      it('should return false if isDDPUser is true', () => {
        expect(
          userHasNeverHadDDP({
            account: {
              user: {
                isDDPUser: true,
                wasDDPUser: false,
              },
            },
          })
        ).toBe(false)
      })
    })

    describe('ddpRenewalEnabled', () => {
      it('should return true if features DDPEnabled and DDPRenewable are both set to true', () => {
        const state = {
          ...enabledFeatureRenewal,
        }
        expect(ddpRenewalEnabled(state)).toBe(true)
      })
      it('should return false one DDPEnabled is false and DDPRenewable is true', () => {
        const state = {
          ...disabledFeatureDDP,
        }
        expect(ddpRenewalEnabled(state)).toBe(false)
      })
      it('should return false one DDPEnabled is true and DDPRenewable is false', () => {
        const state = {
          ...disabledFeatureRenewal,
        }
        expect(ddpRenewalEnabled(state)).toBe(false)
      })
    })

    describe('userCanRenewDDP', () => {
      it('returns false if ifFeatureDDPEnabled is false', () => {
        const state = {
          ...disabledFeatureDDP,
        }
        expect(userCanRenewDDP(state)).toBe(false)
      })
      it('returns true if ifFeatureDDPEnabled is true and hasDDPExpired is true', () => {
        const state = {
          ...enabledFeatureRenewal,
          account: {
            user: {
              isDDPUser: false,
              wasDDPUser: true,
            },
          },
        }
        expect(userCanRenewDDP(state)).toBe(true)
      })
      it('returns true if ifFeatureDDPEnabled is true and isDDPUserInPreExpiryWindow is true', () => {
        const state = {
          ...enabledFeatureRenewal,
          account: {
            user: {
              isDDPUser: true,
              isDDPRenewable: true,
            },
          },
        }
        expect(userCanRenewDDP(state)).toBe(true)
      })
      it("returns false if ifFeatureDDPEnabled user has ddp but isn't in renewable window", () => {
        const state = {
          ...enabledFeatureRenewal,
          account: {
            user: {
              isDDPUser: true,
              isDDPRenewable: false,
            },
          },
        }
        expect(userCanRenewDDP(state)).toBe(false)
      })
    })

    describe('showDDPPromo', () => {
      it('returns true is userCanRenewDDP returns false, and the user is expired with the ddp renewal flag disabled', () => {
        const state = {
          ...disabledFeatureRenewal,
          account: {
            user: {
              wasDDPUser: true,
              isDDPUser: false,
            },
          },
        }
        expect(showDDPPromo(state)).toBe(true)
      })
      it('returns false if userCanRenew returns true, and user is expired with ddp renewal enabled', () => {
        const state = {
          ...enabledFeatureRenewal,
          account: {
            user: {
              wasDDPUser: true,
            },
          },
        }
        expect(showDDPPromo(state)).toBe(false)
      })
      it('returns false if userCanRenew returns false, and ddp renewal is enabled', () => {
        const state = {
          ...enabledFeatureRenewal,
          account: {
            user: {
              isDDPUser: true,
              wasDDPUser: false,
              isDDPRenewable: true,
            },
          },
        }
        expect(showDDPPromo(state)).toBe(false)
      })
      it('returns true is userCanRenewDDP returns false, ddp renewal is enabled, but the user has never had ddp', () => {
        const state = {
          ...enabledFeatureRenewal,
          account: {
            user: {
              isDDPUser: false,
              wasDDPUser: false,
            },
          },
        }
        expect(showDDPPromo(state)).toBe(true)
      })
    })

    describe('isCurrentOrRecentDDPSubscriber', () => {
      it('should return true if isDDPUser status is true', () => {
        expect(
          isCurrentOrRecentDDPSubscriber({
            account: {
              user: {
                isDDPUser: true,
                wasDDPUser: false,
              },
            },
          })
        ).toEqual(true)
      })
      it('should return true if wasDDPUser status is true', () => {
        expect(
          isCurrentOrRecentDDPSubscriber({
            account: {
              user: {
                isDDPUser: false,
                wasDDPUser: true,
              },
            },
          })
        ).toEqual(true)
      })
      it('should return false if isDDPUser status is false and wasDDPUser status is false', () => {
        expect(
          isCurrentOrRecentDDPSubscriber({
            account: {
              user: {
                isDDPUser: false,
                wasDDPUser: false,
              },
            },
          })
        ).toEqual(false)
      })
    })

    const orderHasDDP = {
      checkout: {
        orderSummary: {
          basket: {
            isDDPOrder: true,
          },
        },
      },
    }

    describe('isDDPOrder', () => {
      it('should return isDDPOrder when value exists in the orderSummary - pre order complete state', () => {
        expect(isDDPOrder({ ...orderHasDDP })).toEqual(true)
      })

      it(`should return false when value doesn't exist in the state`, () => {
        expect(isDDPOrder({})).toEqual(false)
      })
    })

    describe('showDDPRenewal', () => {
      it("should return true if userCanRenewDDP and ddp product isn't in shopping bag", () => {
        const state = {
          ...enabledFeatureRenewal,
          account: {
            user: {
              isDDPUser: true,
              isDDPRenewable: true,
            },
          },
        }
        expect(showDDPRenewal(state)).toBe(true)
      })
      it("should return false if user can't renew ddp", () => {
        const state = {
          ...enabledFeatureRenewal,
          account: {
            user: {
              isDDPUser: true,
              isDDPRenewable: false,
              wasDDPUser: true,
            },
          },
        }
        expect(showDDPRenewal(state)).toBe(false)
      })

      it('should return false if user has ddp product in shopping bag', () => {
        const state = {
          ...enabledFeatureRenewal,
          ...shoppingBagWithDDP,
          account: {
            user: {
              isDDPRenewable: true,
            },
          },
        }
        expect(showDDPRenewal(state)).toBe(false)
      })
    })

    describe('isRenewingDDP', () => {
      it('should return true if shopping bag has ddp product and user can renew DDP', () => {
        const state = {
          ...enabledFeatureRenewal,
          ...shoppingBagWithDDP,
          account: {
            user: {
              isDDPUser: false,
              wasDDPUser: true,
            },
          },
        }
        expect(isRenewingDDP(state)).toBe(true)
      })
      it("should return false if shopping bag doesn't have ddp", () => {
        const state = {
          ...enabledFeatureRenewal,
          account: {
            user: {
              isDDPUser: true,
              isDDPRenewable: true,
            },
          },
        }
        expect(isRenewingDDP(state)).toBe(false)
      })
      it('should return false if user is unable to renew ddp', () => {
        const state = {
          ...enabledFeatureRenewal,
          ...shoppingBagWithDDP,
          account: {
            user: {
              isDDPUser: false,
              wasDDPUser: false,
              isDDPRenewable: false,
            },
          },
        }
        expect(isRenewingDDP(state)).toBe(false)
      })
    })

    describe('isDDPOrderComplete', () => {
      it('should return isDDPOrder when value exists in the orderComplete object - post-order state', () => {
        expect(
          isDDPOrderCompleted({
            checkout: {
              orderCompleted: {
                isDDPOrder: true,
              },
            },
          })
        ).toEqual(true)
      })
      it(`should return false when value doesn't exist in the state`, () => {
        expect(isDDPOrderCompleted({})).toEqual(false)
      })
    })

    describe('isDDPStandaloneOrder', () => {
      it('should return true if products array is just a length of one and the order is a DDP order', () => {
        expect(
          isDDPStandaloneOrder({
            checkout: {
              orderSummary: {
                basket: {
                  isDDPOrder: true,
                  products: [
                    { name: 'Topshop Unlimited', orderItemId: 11885791 },
                  ],
                },
              },
            },
          })
        ).toEqual(true)
      })
      it('should return false if products array is more than one and the order is a DDP order', () => {
        expect(
          isDDPStandaloneOrder({
            checkout: {
              orderSummary: {
                basket: {
                  isDDPOrder: true,
                  products: [
                    { name: 'Topshop Unlimited', orderItemId: 11885791 },
                    {
                      name: 'MOTO Orange Side Stripe Jamie Jeans',
                      orderItemId: 11885793,
                    },
                  ],
                },
              },
            },
          })
        ).toEqual(false)
      })
      it('should return false if products array is a length of one and the order is not a DDP order', () => {
        expect(
          isDDPStandaloneOrder({
            checkout: {
              orderSummary: {
                basket: {
                  isDDPOrder: false,
                  products: [
                    {
                      name: 'MOTO Orange Side Stripe Jamie Jeans',
                      orderItemId: 11885793,
                    },
                  ],
                },
              },
            },
          })
        ).toEqual(false)
      })
    })

    describe('isDDPStandaloneOrderCompleted', () => {
      it('should return true if in orderComplete the orderLines array is just a length of one and the order is a DDP order', () => {
        expect(
          isDDPStandaloneOrderCompleted({
            checkout: {
              orderCompleted: {
                orderId: 8353046,
                orderLines: [
                  {
                    colour: 'NONE',
                    discount: '',
                    discountPrice: '0.00',
                    imageUrl:
                      'https://ts-tst1live.tst.digital.arcadiagroup.co.uk/wcsstore/TopShop/images/catalog/TSARCDDP_thumb.jpg',
                    isDDPProduct: true,
                    lineNo: 'Subscription-ddp',
                    name: 'Topshop Unlimited',
                    nonRefundable: false,
                    quantity: 1,
                    size: '12',
                    total: '9.95',
                    unitPrice: '9.95',
                  },
                ],
                isDDPOrder: true,
              },
            },
          })
        ).toEqual(true)
      })
      it('should return false if in orderComplete the orderLines array is just a length of one and the order is a DDP order', () => {
        expect(
          isDDPStandaloneOrderCompleted({
            checkout: {
              orderCompleted: {
                orderId: 8353046,
                orderLines: [{}, {}],
                isDDPOrder: false,
              },
            },
          })
        ).toEqual(false)
      })
      it(`should return false when value doesn't exist in the state`, () => {
        expect(isDDPStandaloneOrderCompleted({})).toEqual(false)
      })
    })

    describe('isDDPPromotionEnabled', () => {
      describe('FEATURE_DISPLAY_DDP_PROMOTION feature flag is enabled', () => {
        const state = {
          features: {
            status: {
              FEATURE_DISPLAY_DDP_PROMOTION: true,
            },
          },
        }

        it('should return true if user is not DDP subscriber and isDDPOrder status is false', () => {
          expect(
            isDDPPromotionEnabled({
              ...state,
              account: {
                user: {
                  isDDPUser: false,
                },
              },
              checkout: {
                orderSummary: {
                  basket: {
                    isDDPOrder: false,
                  },
                },
              },
            })
          ).toEqual(true)
        })

        it('should return false if user is DDP subscriber and not in Renewal Window', () => {
          expect(
            isDDPPromotionEnabled({
              ...state,
              account: {
                user: {
                  isDDPUser: true,
                  isDDPRenewable: false,
                },
              },
            })
          ).toEqual(false)
        })

        it('should return true if user is DDP subscriber in Renewal Window and isDDPOrder status is false', () => {
          expect(
            isDDPPromotionEnabled({
              ...state,
              account: {
                user: {
                  isDDPUser: true,
                  isDDPRenewable: true,
                },
              },
              checkout: {
                orderSummary: {
                  basket: {
                    isDDPOrder: false,
                  },
                },
              },
            })
          ).toEqual(true)
        })

        it('should return false if isDDPOrder status is true', () => {
          expect(
            isDDPPromotionEnabled({
              ...state,
              checkout: {
                orderSummary: {
                  basket: {
                    isDDPOrder: true,
                  },
                },
              },
            })
          ).toEqual(false)
        })

        it(`should return true when values do not exist in the state`, () => {
          expect(isDDPPromotionEnabled(state)).toEqual(true)
        })
      })

      describe('FEATURE_DISPLAY_DDP_PROMOTION feature flag is disabled', () => {
        it('should always return false', () => {
          expect(
            isDDPPromotionEnabled({
              features: {
                status: {
                  FEATURE_DISPLAY_DDP_PROMOTION: false,
                },
              },
              account: {
                user: {
                  isDDPUser: false,
                  isDDPRenewable: false,
                },
              },
              checkout: {
                orderSummary: {
                  basket: {
                    isDDPOrder: false,
                  },
                },
              },
            })
          ).toEqual(false)
        })
      })
    })

    describe('isOrderDDPEligible', () => {
      it('should return true if the user is subscribed to DDP', () => {
        expect(
          isOrderDDPEligible({
            account: {
              user: {
                isDDPUser: true,
              },
            },
            checkout: {
              orderSummary: {
                basket: {
                  isDDPOrder: false,
                },
              },
            },
          })
        ).toBe(true)
      })

      it('should return true if the it is a DDP Order', () => {
        expect(
          isOrderDDPEligible({
            account: {
              user: {
                isDDPUser: false,
              },
            },
            checkout: {
              orderSummary: {
                basket: {
                  isDDPOrder: true,
                },
              },
            },
          })
        ).toBe(true)
      })

      it('should return false if the it is not a DDP Order and the user is not subscribed to DDP', () => {
        expect(
          isOrderDDPEligible({
            account: {
              user: {
                isDDPUser: false,
              },
            },
            checkout: {
              orderSummary: {
                basket: {
                  isDDPOrder: false,
                },
              },
            },
          })
        ).toBe(false)
      })
    })

    describe('isDDPActiveBannerEnabled', () => {
      it('should return true if the user has an active ddp subscription', () => {
        const state = {
          account: {
            user: {
              isDDPUser: true,
              isDDPRenewable: false,
            },
          },
          features: {
            status: {
              FEATURE_DDP: true,
              FEATURE_DDP_IS_ACTIVE_BANNER: true,
            },
          },
        }
        expect(isDDPActiveBannerEnabled(state)).toBe(true)
      })

      it('should return false if the user does not have an active ddp subscription', () => {
        const state = {
          account: {
            user: {
              isDDPUser: true,
              isDDPRenewable: true,
            },
          },
          features: {
            status: {
              FEATURE_DDP: true,
              FEATURE_DDP_IS_ACTIVE_BANNER: true,
            },
          },
        }
        expect(isDDPActiveBannerEnabled(state)).toBe(false)
      })

      it('should return false if the FEATURE_DDP is false', () => {
        const state = {
          account: {
            user: {
              isDDPUser: true,
              isDDPRenewable: true,
            },
          },
          features: {
            status: {
              FEATURE_DDP: false,
              FEATURE_DDP_IS_ACTIVE_BANNER: true,
            },
          },
        }
        expect(isDDPActiveBannerEnabled(state)).toBe(false)
      })

      it('should return false if the FEATURE_DDP_IS_ACTIVE_BANNER is false', () => {
        const state = {
          account: {
            user: {
              isDDPUser: true,
              isDDPRenewable: true,
            },
          },
          features: {
            status: {
              FEATURE_DDP: true,
              FEATURE_DDP_IS_ACTIVE_BANNER: false,
            },
          },
        }
        expect(isDDPActiveBannerEnabled(state)).toBe(false)
      })
    })
    describe('ddpSavingsValue', () => {
      it('should return a number', () => {
        const state = {
          account: {
            user: {
              isDDPUser: true,
              ddpCurrentSaving: '6.45',
              ddpPreviousSaving: '3.55',
            },
          },
        }
        expect(typeof ddpSavingsValue(state)).toBe('number')
      })
      it('should show current savings', () => {
        const state = {
          account: {
            user: {
              isDDPUser: true,
              ddpCurrentSaving: '6.45',
              ddpPreviousSaving: '3.55',
            },
          },
        }
        expect(ddpSavingsValue(state)).toEqual(6.45)
      })
      it('should show previous savings', () => {
        const state = {
          account: {
            user: {
              isDDPUser: false,
              ddpPreviousSaving: '3.55',
            },
          },
        }
        expect(ddpSavingsValue(state)).toEqual(3.55)
      })
      it('should return 0 if selected savings is undefined', () => {
        expect(ddpSavingsValue({})).toEqual(0)
      })
    })
    describe('showDDPSavings', () => {
      it('should return true if savings are greater than 5.00', () => {
        const state = {
          account: {
            user: {
              isDDPUser: true,
              ddpCurrentSaving: '6.45',
            },
          },
        }
        expect(showDDPSavings(state)).toBe(true)
      })
      it('should return true if savings are equal to 5.00', () => {
        const state = {
          account: {
            user: {
              isDDPUser: false,
              ddpPreviousSaving: '5.00',
            },
          },
        }
        expect(showDDPSavings(state)).toBe(true)
      })
      it('should return false if savings are less than 5.00', () => {
        const state = {
          account: {
            user: {
              isDDPUser: false,
              ddpPreviousSaving: '4.99',
            },
          },
        }
        expect(showDDPSavings(state)).toBe(false)
      })
    })
  })

  describe('showActiveDDP', () => {
    describe('when user has an active DDP account', () => {
      it('should return true', () => {
        const state = {
          account: {
            user: {
              isDDPUser: true,
            },
          },
          ...enabledFeatureRenewal,
        }
        expect(showActiveDDP(state)).toBe(true)
      })
    })

    describe('when user has an inactive DDP account', () => {
      it('should return false if user never had ddp', () => {
        const state = {
          account: {
            user: {
              isDDPUser: false,
              wasDDPUser: false,
            },
          },
          ...enabledFeatureRenewal,
        }
        expect(showActiveDDP(state)).toBe(false)
      })
      it('should return false', () => {
        const state = {
          account: {
            user: {
              isDDPUser: false,
              wasDDPUser: true,
            },
          },
          ...enabledFeatureRenewal,
        }
        expect(showActiveDDP(state)).toBe(false)
      })
    })
  })

  describe('getDDPUserAnalyticsProperties', () => {
    const ddpProps = {
      isDDPUser: true,
      wasDDPUser: false,
      isDDPRenewable: true,
      ddpStartDate: '1 May 2019',
      ddpEndDate: '1 May 2020',
      ddpCurrentOrderCount: 3,
      ddpPreviousOrderCount: 0,
    }

    const expectedProps = {
      isDDPUser: 'True',
      wasDDPUser: 'False',
      isDDPRenewable: 'True',
      ddpStartDate: '1 May 2019',
      ddpEndDate: '1 May 2020',
      ddpCurrentOrderCount: 3,
      ddpPreviousOrderCount: 0,
    }

    describe('userTrackingId', () => {
      it('should return empty object if user has no tracking id', () => {
        const state = {
          account: {
            user: {
              isDDPUser: true,
            },
          },
        }
        expect(getDDPUserAnalyticsProperties(state)).toEqual({})
      })
      it('should return expected user props when userTrackingId is defined', () => {
        const state = {
          account: {
            user: {
              userTrackingId: 123456,
              ...ddpProps,
            },
          },
        }
        expect(getDDPUserAnalyticsProperties(state)).toEqual(expectedProps)
      })
    })
    describe('DDP Properties', () => {
      const {
        isDDPUser,
        wasDDPUser,
        isDDPRenewable,
        ddpStartDate,
        ddpEndDate,
        ddpCurrentOrderCount,
        ddpPreviousOrderCount,
      } = getDDPUserAnalyticsProperties({
        account: {
          user: {
            ...ddpProps,
            userTrackingId: 123456,
          },
        },
      })
      it('should convert boolean values to strings', () => {
        expect(isDDPRenewable).toBe('True')
        expect(isDDPUser).toBe('True')
        expect(wasDDPUser).toBe('False')
      })
      it('should return other values as they are provided', () => {
        expect(ddpStartDate).toBe(ddpProps.ddpStartDate)
        expect(ddpEndDate).toBe(ddpProps.ddpEndDate)
        expect(ddpCurrentOrderCount).toBe(ddpProps.ddpCurrentOrderCount)
        expect(ddpPreviousOrderCount).toBe(ddpProps.ddpPreviousOrderCount)
      })
    })
  })

  describe('showDDPRenewalWithinDefaultExpiringBoundaries', () => {
    describe('when `isDDPRenewable` and `ddpRenewalEnabled` are equal to true and ddpProduct not in shopping bag', () => {
      describe('when `isDDPUser` is equal to true and `wasDDPUser` is equal to false', () => {
        it('should return true', () => {
          const state = {
            account: {
              user: {
                isDDPRenewable: true,
                isDDPUser: true,
                wasDDPUser: false,
              },
            },
            ...enabledFeatureRenewal,
          }
          expect(showDDPRenewalWithinDefaultExpiringBoundaries(state)).toBe(
            true
          )
        })
      })

      describe('when `isDDPUser` is equal to false and `wasDDPUser` is equal to true', () => {
        it('should return true', () => {
          const state = {
            account: {
              user: {
                isDDPRenewable: true,
                isDDPUser: false,
                wasDDPUser: true,
              },
            },
            ...enabledFeatureRenewal,
          }
          expect(showDDPRenewalWithinDefaultExpiringBoundaries(state)).toBe(
            true
          )
        })
      })
    })

    describe('when `isDDPRenewable` and `ddpRenewalEnabled` are equal to true and ddpProduct in shopping bag', () => {
      describe('when `isDDPUser` is equal to true and `wasDDPUser` is equal to false', () => {
        it('should return false', () => {
          const state = {
            account: {
              user: {
                isDDPRenewable: true,
                isDDPUser: true,
                wasDDPUser: false,
              },
            },
            ...enabledFeatureRenewal,
            ...shoppingBagWithDDP,
          }
          expect(showDDPRenewalWithinDefaultExpiringBoundaries(state)).toBe(
            false
          )
        })
      })

      describe('when `isDDPUser` is equal to false and `wasDDPUser` is equal to true', () => {
        it('should return false', () => {
          const state = {
            account: {
              user: {
                isDDPRenewable: true,
                isDDPUser: false,
                wasDDPUser: true,
              },
            },
            ...enabledFeatureRenewal,
            ...shoppingBagWithDDP,
          }
          expect(showDDPRenewalWithinDefaultExpiringBoundaries(state)).toBe(
            false
          )
        })
      })
    })

    describe('when `isDDPRenewable` is equal to false, `ddpRenewalEnabled` is equal to true', () => {
      it('should return false', () => {
        const state = {
          account: {
            user: {
              isDDPRenewable: false,
            },
          },
          ...enabledFeatureRenewal,
        }
        expect(showDDPRenewalWithinDefaultExpiringBoundaries(state)).toBe(false)
      })
    })
  })
})
