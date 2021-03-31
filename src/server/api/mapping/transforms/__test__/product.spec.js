import { omit, dissocPath, clone } from 'ramda'
import {
  sortOptionFragment,
  sortOptionsFragment,
  categoryTitleFragment,
  categoryDescriptionFragment,
  reduceRefinementCrumbs,
  breadcrumbsFragment,
  refinementOptionFragment,
  refinementFragment,
  refinementsFragment,
  assetsFragment,
  colourSwatchFragment,
  productFragment,
  plp,
  activeRefinementsFragment,
} from '../product'
import wcs from '../../../../../../test/apiResponses/products-search/wcs.json'
import wcsBurton from 'test/apiResponses/products-search/wcs-burton.json'
import wcsWithSegmentedContent from '../../../../../../test/apiResponses/products-search/wcs-withSegmentedContent.json'
import monty from '../../../../../../test/apiResponses/products-search/hapiMonty.json'
import montyBurton from 'test/apiResponses/products-search/hapiMonty-burton.json'
import wcsWithRefinements from 'test/apiResponses/products-search/wcs-refinements.json'
import hapiRefinementCrumbs from 'test/apiResponses/products-search/hapi-refinements.json'
import wcsEndecaResponseToRedirect from 'test/apiResponses/products-endeca-redirect/wcs.json'
import hapiEndecaResponseToRedirect from 'test/apiResponses/products-endeca-redirect/hapi.json'
import { assetTypes, additionalAssetsTypes } from '../../constants/product'

const hostName = 'http://www.topshop.com.arcadiagroup.co.uk'

const montyWithClickableBreadcrumbs = {
  ...monty,
  breadcrumbs: [
    monty.breadcrumbs[0],
    {
      ...monty.breadcrumbs[1],
      url:
        '/en/tsuk/category/new-in-this-week-2169932/_/N-8cnZdgl?Nrpp=20&siteId=%2F12556',
    },
    monty.breadcrumbs[2],
  ],
}
const montyBurtonWithClickableBreadcrumbs = {
  ...montyBurton,
  breadcrumbs: [
    montyBurton.breadcrumbs[0],
    {
      ...montyBurton.breadcrumbs[1],
      url:
        '/en/bruk/category/shoes-6574209/_/N-91mZ8jb?Nrpp=20&siteId=%2F12551',
    },
    montyBurton.breadcrumbs[2],
  ],
}

const sortFakeOptions = {
  label: 'FakeLael',
  value: 'FakeValue',
  navigationState: '',
}

describe('transform plp', () => {
  describe('sortOptionFragment', () => {
    it('transforms wcs sortOption to monty sortOption', () => {
      expect(
        sortOptionFragment(wcs.plpJSON.results.contents[0].sortOptions[0])
      ).toEqual(monty.sortOptions[0])
    })
    it('Return undefined if wrong/bad/notexisting label or object', () => {
      expect(sortOptionFragment(sortFakeOptions)).toBe(undefined)
    })
  })
  describe('sortOptionsFragment', () => {
    it('transforms wcs sortOptions to monty sortOptions', () => {
      expect(sortOptionsFragment(wcs.plpJSON.results)).toEqual(
        monty.sortOptions
      )
    })
    it('sortOptionsFragment returns an empty array if its paths are undefined', () => {
      expect(sortOptionsFragment({})).toEqual([])
      expect(sortOptionsFragment({ contents: [] })).toEqual([])
      expect(sortOptionsFragment({ contents: [{}] })).toEqual([])
    })
    it('Return the translated label if translatedLabel is there', () => {
      const sortOptionTranslated = {
        label: 'Relevance_content',
        selected: true,
        navigationState: '/en/tsuk/category/fake',
        siteRootPath: '/pages',
        contentPath: '/browse',
        translatedLabel: 'Compatibilité',
      }
      const expected = {
        label: 'Compatibilité',
        value: 'Relevance',
        navigationState: '/en/tsuk/category/fake',
      }
      expect(sortOptionFragment(sortOptionTranslated)).toEqual(expected)
    })
  })
  describe('categoryTitleFragment', () => {
    it('transforms wcs plpJSON to monty categoryTitle', () => {
      expect(categoryTitleFragment(wcs.plpJSON)).toBe(monty.categoryTitle)
    })
    it('categoryTitleFragment returns an empty string if its paths are undefined', () => {
      expect(categoryTitleFragment({ Breadcrumbs: {} })).toBe('')
      expect(categoryTitleFragment({ Breadcrumbs: [{}] })).toBe('')
      expect(
        categoryTitleFragment({ Breadcrumbs: [{ refinementCrumbs: {} }] })
      ).toBe('')
      expect(
        categoryTitleFragment({ Breadcrumbs: [{ refinementCrumbs: [{}] }] })
      ).toBe('')
    })
    it("Will filter refinements where the dimensionName does not contain 'category'", () => {
      const withRefinement = {
        Breadcrumbs: [
          {
            refinementCrumbs: [
              {
                dimensionName: 'c4tegory',
                label: 'Blue',
              },
            ],
          },
        ],
      }
      expect(categoryTitleFragment(withRefinement)).toBe('')
    })
  })

  describe('categoryDescriptionFragment', () => {
    it('transforms wcs plpJSON to monty categoryDescription', () => {
      expect(categoryDescriptionFragment(wcs.plpJSON)).toBe(
        monty.categoryDescription
      )
    })
    it('categoryDescriptionFragment returns an empty string if its paths are undefined', () => {
      expect(categoryDescriptionFragment({ metaDescription: undefined })).toBe(
        ''
      )
    })
  })
  describe('refinementCrumbs', () => {
    it('reduces wcs refinementCrumbs to monty breadcrumbs', () => {
      expect(
        reduceRefinementCrumbs(
          [],
          wcs.plpJSON.Breadcrumbs[0].refinementCrumbs[0]
        )
      ).toEqual(montyWithClickableBreadcrumbs.breadcrumbs.slice(1))
    })
    it('does not break if ancestors array is missing', () => {
      const noAncestors = omit(
        ['ancestors'],
        wcs.plpJSON.Breadcrumbs[0].refinementCrumbs[0]
      )
      expect(reduceRefinementCrumbs([], noAncestors)).toEqual([
        Object.assign({}, monty.breadcrumbs[2], { category: '277012' }),
      ])
    })
    it('does not return a refinement if there is no dimensionName property', () => {
      const noDimensionName = omit(
        ['dimensionName'],
        wcs.plpJSON.Breadcrumbs[0].refinementCrumbs[0]
      )
      expect(reduceRefinementCrumbs([], noDimensionName)).toEqual([])
    })

    it("should return a refinement if the dimensionName contains the string 'category'", () => {
      expect(
        reduceRefinementCrumbs(
          [],
          wcsBurton.plpJSON.Breadcrumbs[0].refinementCrumbs[0]
        )
      ).toEqual(montyBurtonWithClickableBreadcrumbs.breadcrumbs.slice(1))
    })
    it('does not add to a category to if source id is missing', () => {
      const noDimensionName = omit(
        ['properties'],
        wcs.plpJSON.Breadcrumbs[0].refinementCrumbs[0]
      )
      expect(reduceRefinementCrumbs([], noDimensionName)).toEqual(
        montyWithClickableBreadcrumbs.breadcrumbs
          .slice(1)
          .map((item) => Object.assign({}, item, { category: '208491' }))
      )
    })
  })
  describe('breadcrumbsFragment', () => {
    it('transforms wcs Breadcrumbs to monty breadcrumbs', () => {
      expect(breadcrumbsFragment(wcs.plpJSON.Breadcrumbs)).toEqual(
        montyWithClickableBreadcrumbs.breadcrumbs
      )
    })
    it('should provide urls for all breadcrumbs, aside from the most specific one', () => {
      const breadcrumbs = breadcrumbsFragment(wcs.plpJSON.Breadcrumbs)
      breadcrumbs.forEach((breadcrumb, index) => {
        const finalBreadcrumbIndex = breadcrumbs.length - 1
        if (index === finalBreadcrumbIndex) {
          expect(breadcrumb).not.toHaveProperty('url')
        } else {
          expect(breadcrumb).toHaveProperty('url')
        }
      })
    })
    it('breadcrumbsFragment returns an empty array if its paths are undefined', () => {
      expect(breadcrumbsFragment([])).toEqual([])
      expect(breadcrumbsFragment([{}])).toEqual([])
    })
  })
  describe('refinementOptionFragment', () => {
    const wcsRefinementOption = wcs.plpJSON.Navigation[0][0].refinements[0]
    it('transforms wcs refinement to monty refinementOption', () => {
      expect(refinementOptionFragment(wcsRefinementOption)).toEqual(
        monty.refinements[0].refinementOptions[0]
      )
    })
    it('set seoUrl as blank if navigationState it is missing', () => {
      expect(
        refinementOptionFragment(omit(['navigationState'], wcsRefinementOption))
      ).toEqual(
        Object.assign({}, monty.refinements[0].refinementOptions[0], {
          seoUrl: '',
        })
      )
    })
    it('set seoUrl as navigationState if it is a string', () => {
      expect(
        refinementOptionFragment({
          ...wcsRefinementOption,
          navigationState: wcsRefinementOption.navigationState[0],
        })
      ).toEqual(monty.refinements[0].refinementOptions[0])
    })
  })
  describe('refinementFragment', () => {
    it('transforms wcs refinements to monty refinement', () => {
      expect(refinementFragment(wcs.plpJSON.Navigation[0][0])).toEqual(
        monty.refinements[0]
      )
    })
    it('sets label to name if the path is missing', () => {
      const noLabel = { ...wcs.plpJSON.Navigation[0][0] }
      noLabel.refinements[0].properties.refinement_name = ''
      expect(refinementFragment(noLabel)).toEqual(monty.refinements[0])
    })
    it('sets refinementOptions to an empty array and label to an empty stringif the path is missing', () => {
      const noProperties = omit(
        ['refinements', 'name'],
        wcs.plpJSON.Navigation[0][0]
      )
      expect(refinementFragment(noProperties)).toEqual(
        Object.assign({}, monty.refinements[0], {
          label: '',
          refinementOptions: [],
        })
      )
    })
  })
  describe('refinementsFragment', () => {
    it('transforms wcs Navigation to monty refinements', () => {
      expect(refinementsFragment(wcs.plpJSON.Navigation)).toEqual(
        monty.refinements
      )
    })
    it('returns an empty array if its paths are undefined', () => {
      expect(refinementsFragment([])).toEqual([])
    })
  })

  describe('activeRefinementsFragment', () => {
    describe('given a response with Breadcrumb and Navigation objects', () => {
      it('should transform them', () => {
        expect(
          activeRefinementsFragment(wcsWithRefinements.plpJSON.Breadcrumbs[0])
        ).toEqual(hapiRefinementCrumbs)
      })
    })
  })

  describe('assetsFragment', () => {
    it('transforms wcs images to monty assets', () => {
      const montyAssets = monty.products[0].assets
      const assets = assetsFragment(
        'http://www.topshop.com.arcadiagroup.co.uk',
        wcs.plpJSON.results.contents[0].records[0],
        'topshop',
        'tsuk',
        assetTypes
      )
      expect(assets).toEqual(montyAssets)
    })
    it('returns an empty array if its paths are undefined', () => {
      expect(assetsFragment([])).toEqual([])
    })
    it('transforms wcs images to monty additional assets', () => {
      // @NOTE extending expected hapi-monty product plp result after adding new image sizes
      const expected = [
        ...monty.products[0].additionalAssets,
        {
          assetType: 'IMAGE_BANNER_MOBILE',
          index: 1,
          url:
            'http://media.topshop.com/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color7/cms/pages/static/static-0000103444/images/Banner_Mobile_DorothyPerkins.png',
        },
      ]
      const expectedStatic = [
        ...monty.products[0].additionalAssets,
        {
          assetType: 'IMAGE_BANNER_MOBILE',
          index: 1,
          url: 'https://test.domain/images/Banner_Mobile_DorothyPerkins.png',
        },
      ]
      expectedStatic[12] = {
        assetType: 'IMAGE_BANNER_SMALL',
        index: 1,
        url: 'https://test.domain/images/Banner_Small_DorothyPerkins.png',
      }
      expectedStatic[13] = {
        assetType: 'IMAGE_BANNER_MEDIUM',
        index: 1,
        url: 'https://test.domain/images/Banner_Medium_DorothyPerkins.png',
      }
      expectedStatic[14] = {
        assetType: 'IMAGE_BANNER_LARGE',
        index: 1,
        url: 'https://test.domain/images/Banner_Large_DorothyPerkins.png',
      }
      const assets = assetsFragment(
        'http://www.topshop.com.arcadiagroup.co.uk',
        wcs.plpJSON.results.contents[0].records[0],
        'topshop',
        'tsuk',
        additionalAssetsTypes
      )
      const assetsStatic = assetsFragment(
        'http://www.topshop.com.arcadiagroup.co.uk',
        {
          ...wcs.plpJSON.results.contents[0].records[0],
          bannersSmallImg:
            'https://test.domain/images/Banner_Small_DorothyPerkins.png',
          bannersMediumImg:
            'https://test.domain/images/Banner_Medium_DorothyPerkins.png',
          bannersLargeImg:
            'https://test.domain/images/Banner_Large_DorothyPerkins.png',
        },
        'topshop',
        'tsuk',
        additionalAssetsTypes
      )
      expect(assets).toEqual(expected)
      expect(assetsStatic).toEqual(expectedStatic)
    })

    it('builds correct image URLs based on storeCode', () => {
      const productImage = 'image-one'
      const index = 1
      const assetType = 'type'
      const assets = assetsFragment(
        undefined,
        { productImage },
        'missselfridge',
        'msuk',
        [{ property: 'productImage', index, type: assetType }]
      )
      expect(assets).toEqual([
        {
          index,
          assetType,
          url: `http://media.missselfridge.com/wcsstore/MissSelfridge/${productImage}`,
        },
      ])
    })

    describe('an outfit image is the same as the product image', () => {
      it('it should not map the outfit image', () => {
        const product = {
          outfitImage: 'images/catalog/BR79C02OGRY_3col_F_1.jpg',
          productImage: 'images/catalog/BR79C02OGRY_3col_F_1.jpg',
        }
        const assets = assetsFragment(
          'http://www.topshop.com.arcadiagroup.co.uk',
          product,
          'topshop',
          'tsuk',
          additionalAssetsTypes
        )
        expect(assets).toEqual([
          {
            assetType: 'IMAGE_ZOOM',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/BR79C02OGRY_Zoom_F_1.jpg',
          },
          {
            assetType: 'IMAGE_2COL',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/BR79C02OGRY_2col_F_1.jpg',
          },
          {
            assetType: 'IMAGE_3COL',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/BR79C02OGRY_3col_F_1.jpg',
          },
          {
            assetType: 'IMAGE_4COL',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/BR79C02OGRY_4col_F_1.jpg',
          },
        ])
      })
    })

    it('maps attribute badges and banners', () => {
      const product = {
        badgesSmallImg:
          '/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Badge_Small_Petite3.png',
        badgesMediumImg:
          '/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Badge_Medium_Petite3.png',
        badgesLargeImg:
          '/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Badge_Large_Petite3.png',
        bannersSmallImg:
          '/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Banner_Small_Petite3.png',
        bannersMediumImg:
          '/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Banner_Medium_Petite3.png',
        bannersLargeImg:
          '/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Banner_Large_Petite3.png',
      }

      const additionalAssets = assetsFragment(
        'http://www.wallis.co.uk',
        product,
        'wallis',
        'wluk',
        additionalAssetsTypes
      )

      expect(additionalAssets).toEqual([
        {
          assetType: 'IMAGE_BADGE_SMALL',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Badge_Small_Petite3.png',
        },
        {
          assetType: 'IMAGE_BADGE_MEDIUM',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Badge_Medium_Petite3.png',
        },
        {
          assetType: 'IMAGE_BADGE_LARGE',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Badge_Large_Petite3.png',
        },
        {
          assetType: 'IMAGE_BADGE_MOBILE',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Badge_Mobile_Petite3.png',
        },
        {
          assetType: 'IMAGE_BANNER_SMALL',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Banner_Small_Petite3.png',
        },
        {
          assetType: 'IMAGE_BANNER_MEDIUM',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Banner_Medium_Petite3.png',
        },
        {
          assetType: 'IMAGE_BANNER_LARGE',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Banner_Large_Petite3.png',
        },
        {
          assetType: 'IMAGE_BANNER_MOBILE',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color8/cms/pages/static/static-0000109785/images/Banner_Mobile_Petite3.png',
        },
      ])
    })

    it('maps promo banners', () => {
      const product = {
        promoCalcode: '627587',
      }

      const additionalAssets = assetsFragment(
        'http://www.wallis.co.uk',
        product,
        'wallis',
        'wluk',
        additionalAssetsTypes
      )

      expect(additionalAssets).toEqual([
        {
          assetType: 'IMAGE_PROMO_GRAPHIC_SMALL',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/Wallis/images/category_icons/promo_code_627587_small.png',
        },
        {
          assetType: 'IMAGE_PROMO_GRAPHIC_MEDIUM',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/Wallis/images/category_icons/promo_code_627587_medium.png',
        },
        {
          assetType: 'IMAGE_PROMO_GRAPHIC_LARGE',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/Wallis/images/category_icons/promo_code_627587_large.png',
        },
        {
          assetType: 'IMAGE_PROMO_GRAPHIC_MOBILE',
          index: 1,
          url:
            'http://media.wallis.co.uk/wcsstore/Wallis/images/category_icons/promo_code_627587_mobile.png',
        },
      ])
    })
  })

  describe('colourSwatchFragment', () => {
    const wcsSwatch = colourSwatchFragment(
      wcs.plpJSON.results.contents[0].records[4].swatches[0],
      'topshop',
      'tsuk',
      hostName
    )
    const wcsWasPriceSwatch = colourSwatchFragment(
      wcs.plpJSON.results.contents[0].records[4].swatches[1],
      'topshop',
      'tsuk',
      hostName
    )
    const montySwatch = monty.products[4].colourSwatches[0]
    const montySwatchWithWasWasPrice = monty.products[4].colourSwatches[1]

    it('transforms wcs swatch to monty colourSwatch', () => {
      expect(
        dissocPath(['swatchProduct', 'additionalAssets'], wcsSwatch)
      ).toEqual(montySwatch)
      expect(
        dissocPath(['swatchProduct', 'additionalAssets'], wcsWasPriceSwatch)
      ).toEqual(montySwatchWithWasWasPrice)
    })

    it('transforms wcs swatch to monty swatch with Amplience images', () => {
      const wcsSwatchModified = {
        ...wcsSwatch,
        productBaseImageUrl: 'http://topshop.com/product-base-image-url',
        outfitBaseImageUrl: 'http://topshop.com/outfit-base-image-url',
      }
      const montySwatchModified = clone(montySwatch)
      montySwatchModified.swatchProduct = {
        ...montySwatch.swatchProduct,
        productBaseImageUrl: 'http://topshop.com/product-base-image-url',
        outfitBaseImageUrl: 'http://topshop.com/outfit-base-image-url',
      }
      const result = colourSwatchFragment(
        wcsSwatchModified,
        'topshop',
        hostName
      )

      expect(result.swatchProduct.productBaseImageUrl).toEqual(
        montySwatchModified.swatchProduct.productBaseImageUrl
      )
      expect(result.swatchProduct.outfitBaseImageUrl).toEqual(
        montySwatchModified.swatchProduct.outfitBaseImageUrl
      )
    })
  })
  describe('productFragment', () => {
    const wcsProduct = wcs.plpJSON.results.contents[0].records[0]
    // @NOTE extending expected hapi-monty product plp result after adding new image sizes
    const montyProduct = {
      ...monty.products[0],
      additionalAssets: [
        ...monty.products[0].additionalAssets,
        {
          assetType: 'IMAGE_BANNER_MOBILE',
          index: 1,
          url:
            'http://media.topshop.com/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color7/cms/pages/static/static-0000103444/images/Banner_Mobile_DorothyPerkins.png',
        },
      ],
    }
    it('transforms wcs record to monty product', () => {
      expect(productFragment(wcsProduct, 'topshop', 'tsuk', hostName)).toEqual(
        montyProduct
      )
    })
    it('transforms wcs record to monty product where there was one was prices', () => {
      const wcsProductModified = { ...wcsProduct, was1Price: 45.0 }
      const montyProductModified = { ...montyProduct, wasPrice: '45.00' }
      expect(
        productFragment(wcsProductModified, 'topshop', 'tsuk', hostName)
      ).toEqual(montyProductModified)
    })
    it('transforms wcs record to monty product where there were two was prices', () => {
      const wcsProductModified = {
        ...wcsProduct,
        was1Price: 60.0,
        was2Price: 55.0,
      }
      const montyProductModified = {
        ...montyProduct,
        wasWasPrice: '60.00',
        wasPrice: '55.00',
      }
      expect(
        productFragment(wcsProductModified, 'topshop', 'tsuk', hostName)
      ).toEqual(montyProductModified)
    })
    it('transforms wcs record to monty product with Amplience images', () => {
      const wcsProductModified = {
        ...wcsProduct,
        productBaseImageUrl: 'http://topshop.com/product-base-image-url',
        outfitBaseImageUrl: 'http://topshop.com/outfit-base-image-url',
      }
      const montyProductModified = {
        ...montyProduct,
        productBaseImageUrl: 'http://topshop.com/product-base-image-url',
        outfitBaseImageUrl: 'http://topshop.com/outfit-base-image-url',
      }
      expect(
        productFragment(wcsProductModified, 'topshop', 'tsuk', hostName)
      ).toEqual(montyProductModified)
    })
  })
  describe('plp', () => {
    describe('endeca redirectURL response', () => {
      it('is mapped correctly', () => {
        const result = plp(wcsEndecaResponseToRedirect)
        expect(result).toEqual(hapiEndecaResponseToRedirect)
      })
    })

    describe('with permanent redirect URL', () => {
      it('is mapped correctly', () => {
        const permanentRedirectUrl = 'permanent-redirect-url'
        const result = plp({
          ...wcsEndecaResponseToRedirect,
          permanentRedirectUrl,
        })
        expect(result.permanentRedirectUrl).toBe(permanentRedirectUrl)
      })
    })

    describe('category title', () => {
      it('should return category title when provided with plp json', () => {
        const categoryTitle = 'blue jeans'
        const result = plp({
          plpJSON: {
            categoryTitle,
          },
        })
        expect(result).toEqual(expect.objectContaining({ categoryTitle }))
      })

      it('should return category title when provided with Breadcrumbs', () => {
        const categoryTitle = 'blue jacket'
        const result = plp({
          plpJSON: {
            Breadcrumbs: [
              {
                searchCrumbs: [
                  {
                    terms: categoryTitle,
                  },
                ],
              },
            ],
          },
        })
        expect(result).toEqual(expect.objectContaining({ categoryTitle }))
      })
    })

    describe('Remove All Filters', () => {
      it('should return the removeAllAction Object', () => {
        const removeAllAction = {
          seoUrl: 'some/seo/url',
          someaction: 'someAction',
        }
        const result = plp({
          plpJSON: {
            Breadcrumbs: [
              {
                removeAllAction,
              },
            ],
          },
        })
        expect(result).toEqual(
          expect.objectContaining({ removeAllRefinement: removeAllAction })
        )
      })
    })

    describe('title', () => {
      it('should return title when provided with plp json', () => {
        const title = 'some title'
        const searchTerm = 'some search term'
        const result = plp({
          plpJSON: {
            title,
            Breadcrumbs: [
              {
                searchCrumbs: [
                  {
                    terms: searchTerm,
                  },
                ],
              },
            ],
          },
        })
        expect(result).toEqual(expect.objectContaining({ title }))
        expect(result.title).not.toEqual(searchTerm)
      })
      it('should return search term when no title provided with plp json', () => {
        const title = ''
        const searchTerm = 'some search term'
        const result = plp({
          plpJSON: {
            title,
            Breadcrumbs: [
              {
                searchCrumbs: [
                  {
                    terms: searchTerm,
                  },
                ],
              },
            ],
          },
        })
        expect(result).toEqual(expect.objectContaining({ title: searchTerm }))
      })
    })

    it('should return title when provided with plp json', () => {
      const pageTitle = 'foo bar'
      const result = plp({
        plpJSON: {
          pageTitle,
        },
      })
      expect(result.pageTitle).toBe(pageTitle)
    })

    describe('noIndex flag for PLP', () => {
      it('maps noIndex flag to true by default', () => {
        const result = plp({
          plpJSON: {},
        })
        expect(result.shouldIndex).toBe(true)
      })
      it('maps noIndex flag to shouldIndex true', () => {
        const result = plp({
          plpJSON: {
            noIndex: 'No',
          },
        })
        expect(result.shouldIndex).toBe(true)
      })
      it('maps noIndex flag to true by default', () => {
        const result = plp({
          plpJSON: {
            noIndex: 'Yes',
          },
        })
        expect(result.shouldIndex).toBe(false)
      })
    })

    it('transforms the wcs plp to monty plp', () => {
      // testing broken up as we provide a better response than monty :)
      // and expect.objectContaining cares about arrays too much
      const result = plp(wcs, 'topshop', 'tsuk', hostName)

      expect(result.breadcrumbs).toEqual(
        montyWithClickableBreadcrumbs.breadcrumbs
      )
      expect(result.categoryRefinement).toEqual(monty.categoryRefinement)
      expect(result.refinements).toEqual(monty.refinements)
      expect(result.canonicalUrl).toEqual(monty.canonicalUrl)

      result.products.forEach((product, i) => {
        expect(product.productId).toEqual(monty.products[i].productId)
        expect(product.lineNumber).toEqual(monty.products[i].lineNumber)

        expect(product.name).toEqual(monty.products[i].name)
        expect(product.unitPrice).toEqual(monty.products[i].unitPrice)
        expect(product.productUrl).toEqual(monty.products[i].productUrl)
        expect(product.seoUrl).toEqual(monty.products[i].seoUrl)
        expect(product.assets).toEqual(
          expect.arrayContaining(monty.products[i].assets)
        )
        expect(product.additionalAssets).toEqual(
          expect.arrayContaining(monty.products[i].additionalAssets)
        )
        expect(product.items).toEqual(monty.products[i].items)
        expect(product.bundleProducts).toEqual(monty.products[i].bundleProducts)
        expect(product.attributes).toEqual(monty.products[i].attributes)

        product.colourSwatches.forEach((swatch, j) => {
          expect(
            dissocPath(['swatchProduct', 'additionalAssets'], swatch)
          ).toEqual(monty.products[i].colourSwatches[j])
        })

        expect(product.tpmLinks).toEqual(monty.products[i].tpmLinks)
        expect(product.bundleSlots).toEqual(monty.products[i].bundleSlots)
        expect(product.ageVerificationRequired).toEqual(
          monty.products[i].ageVerificationRequired
        )
        expect(product.ageVerificationRequired).toEqual(
          monty.products[i].ageVerificationRequired
        )
        expect(product.isBundleOrOutfit).toEqual(
          monty.products[i].isBundleOrOutfit
        )
        expect(product.bundleType).toEqual(monty.products[i].bundleType)
        expect(product.bazaarVoiceData).toEqual(
          monty.products[i].bazaarVoiceData
        )
      })

      expect(result.categoryTitle).toEqual(monty.categoryTitle)
      expect(result.categoryDescription).toEqual(monty.categoryDescription)
      expect(result.totalProducts).toEqual(monty.totalProducts)
      expect(result.searchTerm).toEqual(monty.searchTerm)
      expect(result.plpContentSlot).toEqual(monty.plpContentSlot)
      expect(result.recordSpotlight).toEqual(monty.recordSpotlight)
      expect(result.defaultImgType).toEqual(monty.defaultImgType)
      expect(result.categoryBanner).toEqual(monty.categoryBanner)
      expect(result.title).toEqual(monty.title)
      expect(result.shouldIndex).toBe(true)
    })

    it('passes through globalEspot from the wcs response to monty product', () => {
      expect(plp(wcsWithSegmentedContent, 'burton').globalEspot).toEqual(
        wcsWithSegmentedContent.globalEspot
      )
    })
  })
})
