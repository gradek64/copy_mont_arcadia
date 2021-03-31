import * as pdpTransformers from '../pdp'
import wcsPdpResponseExample from 'test/apiResponses/pdp/wcs_mod_for_tests.json'
import hapiMontyResponseExample from 'test/apiResponses/pdp/hapiMonty.json'
import wcsPdpResponseSwatchesExample from 'test/apiResponses/pdp/swatches/wcs_swatches.json'
import hapiMontyResponseSwatchesExample from 'test/apiResponses/pdp/swatches/hapiMonty_swatches.json'
import wcs from 'test/apiResponses/pdp/wcs.json'
import wcsNoThumbnails from 'test/apiResponses/pdp/wcs-no-thumbnails.json'
import hapiNoThumbnails from 'test/apiResponses/pdp/hapi-no-thumbnails.json'
import wcsFixedBundle from 'test/apiResponses/pdp/bundles/fixed/wcs_fixed_bundle.json'
import hapiFixedBundle from 'test/apiResponses/pdp/bundles/fixed/hapiMonty_fixed_bundle.json'
import wcsFlexibleBundle from 'test/apiResponses/pdp/bundles/flexible/wcs_flexible_bundle.json'
import hapiFlexibleBundle from 'test/apiResponses/pdp/bundles/flexible/hapiMonty_flexible_bundle.json'
import wcsVideoProduct from 'test/apiResponses/pdp/wcs_video.json'
import hapiVideoProduct from 'test/apiResponses/pdp/hapi_video.json'
import { omit, clone } from 'ramda'

describe('#additionalAssets', () => {
  it('returns empty array in case of invalid arguments provided', () => {
    expect(pdpTransformers.additionalAssets()).toEqual([])
    expect(pdpTransformers.additionalAssets('a', ['a'], 'a')).toEqual([])
    expect(pdpTransformers.additionalAssets(['a'], 'a', 'a')).toEqual([])
    expect(pdpTransformers.additionalAssets(['a'], ['b'], { c: 'c' })).toEqual(
      []
    )
  })

  it('maps correctly additional assets', () => {
    const wcsAssetsThumbnails = wcsPdpResponseExample.productData.thumbnails
    const wcsAssetsThumbnailimageurls =
      wcsPdpResponseExample.productData.assets.Thumbnailimageurls
    const grouping = wcsPdpResponseExample.productData.grouping

    expect(
      pdpTransformers.additionalAssets(
        wcsAssetsThumbnails,
        wcsAssetsThumbnailimageurls,
        grouping
      )
    ).toEqual(hapiMontyResponseExample.additionalAssets)
  })
})

describe('#mapAssets', () => {
  it('returns empty array in case of invalid arguments provided', () => {
    expect(pdpTransformers.mapAssets()).toEqual([])
    expect(pdpTransformers.mapAssets([])).toEqual([])
    expect(pdpTransformers.mapAssets('a')).toEqual([])
    expect(pdpTransformers.mapAssets({ a: 'a' })).toEqual([])
  })

  describe('products without video assets', () => {
    it('are mapped as expected', () => {
      const wcsAssets =
        wcsPdpResponseExample.productData.assets.Thumbnailimageurls
      expect(pdpTransformers.mapAssets(wcsAssets)).toEqual(
        hapiMontyResponseExample.assets
      )
    })
  })

  describe('products with video assets', () => {
    it('are mapped as expected', () => {
      const wcsAssets = wcsVideoProduct.productData.assets.Thumbnailimageurls
      expect(pdpTransformers.mapAssets(wcsAssets)).toEqual(
        hapiVideoProduct.assets
      )
    })
  })
})

describe('mapAmplienceAssets', () => {
  it('does not add Amplience assets if they are not returned by WCS', () => {
    expect(pdpTransformers.mapAmplienceAssets([{}, {}])).toBeUndefined()
  })

  it('maps the "normal" thumbnail image url in an expected format', () => {
    const amplienceImageUrl1 = 'http://www.topshop.com/asset/bar_normal'
    const amplienceImageUrl2 = 'http://www.topshop.com/asset/bar_normal'
    const wcsAssets = [
      { baseImageUrl: amplienceImageUrl1, bundleCatentryId: null },
      { baseImageUrl: amplienceImageUrl1, bundleCatentryId: null },
      { baseImageUrl: amplienceImageUrl1, bundleCatentryId: 123 },
    ]

    const { images } = pdpTransformers.mapAmplienceAssets(
      wcsAssets
    ).amplienceAssets

    expect(images).toEqual([amplienceImageUrl1, amplienceImageUrl2])
  })

  it('maps video', () => {
    const baseVideoUrl = 'http://video-url'
    const wcsAssets = [{ baseVideoUrl }]

    const { amplienceAssets } = pdpTransformers.mapAmplienceAssets(wcsAssets)

    expect(amplienceAssets.video).toEqual(baseVideoUrl)
  })

  it('fails gracefully if assets is not an array', () => {
    const amplienceAssets = pdpTransformers.mapAmplienceAssets('invalid type')

    expect(amplienceAssets).toBeUndefined()
  })
})

describe('#mapSwatches', () => {
  it('returns empty array for empty arguments', () => {
    expect(pdpTransformers.mapSwatches()).toEqual([])
  })

  it('returns empty array in case of invalid arguments provided', () => {
    expect(pdpTransformers.mapSwatches([])).toEqual([])
    expect(pdpTransformers.mapAssets([])).toEqual([])
    expect(pdpTransformers.mapAssets('a')).toEqual([])
    expect(pdpTransformers.mapAssets({ a: 'a' })).toEqual([])
  })

  it('maps swatches as expected', () => {
    expect(
      pdpTransformers.mapSwatches(wcsPdpResponseSwatchesExample.colourSwatches)
    ).toEqual(hapiMontyResponseSwatchesExample.colourSwatches)
  })
})

describe('#generateBundleProductAssets', () => {
  it('returns the correct assets array when imageUrl is an amplience url', () => {
    const urls = [
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA$Small$.jpg',
      'https://images.topshop.com/i/TopShop/TS05J54NLIL_M_1.jpg?$Small$',
    ]

    urls.forEach((imgUrl) => {
      expect(
        pdpTransformers.mapFlexibleBundleProduct(
          {
            bundleDetailsForm0: {
              products: [
                {
                  imgFullImg: imgUrl,
                },
              ],
            },
          },
          0
        ).assets
      ).toEqual([
        {
          assetType: 'IMAGE_SMALL',
          index: 1,
          url: imgUrl.replace('Small', 'Thumb'),
        },
        {
          assetType: 'IMAGE_THUMB',
          index: 1,
          url: imgUrl,
        },
        {
          assetType: 'IMAGE_NORMAL',
          index: 1,
          url: imgUrl.replace('Small', '2col'),
        },
        {
          assetType: 'IMAGE_LARGE',
          index: 1,
          url: imgUrl.replace('Small', 'Zoom'),
        },
      ])
    })
  })

  it('returns the right assets array when the imageUrl contains _Small_', () => {
    const imgUrl =
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_Small_F_1.jpg'

    expect(
      pdpTransformers.mapFlexibleBundleProduct(
        {
          bundleDetailsForm0: {
            products: [
              {
                imgFullImg: imgUrl,
              },
            ],
          },
        },
        0
      ).assets
    ).toEqual([
      {
        assetType: 'IMAGE_SMALL',
        index: 1,
        url:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_Thumb_F_1.jpg',
      },
      {
        assetType: 'IMAGE_THUMB',
        index: 1,
        url:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_Small_F_1.jpg',
      },
      {
        assetType: 'IMAGE_NORMAL',
        index: 1,
        url:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_2col_F_1.jpg',
      },
      {
        assetType: 'IMAGE_LARGE',
        index: 1,
        url:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_Zoom_F_1.jpg',
      },
    ])
  })

  it('returns the right assets array when the imageUrl contains _small_', () => {
    const imgUrl =
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_small.jpg'

    expect(
      pdpTransformers.mapFlexibleBundleProduct(
        {
          bundleDetailsForm0: {
            products: [
              {
                imgFullImg: imgUrl,
              },
            ],
          },
        },
        0
      ).assets
    ).toEqual([
      {
        assetType: 'IMAGE_SMALL',
        index: 1,
        url:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_thumb.jpg',
      },
      {
        assetType: 'IMAGE_THUMB',
        index: 1,
        url:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_small.jpg',
      },
      {
        assetType: 'IMAGE_NORMAL',
        index: 1,
        url:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_2col.jpg',
      },
      {
        assetType: 'IMAGE_LARGE',
        index: 1,
        url:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03L01LKHA_zoom.jpg',
      },
    ])
  })

  it('handles the case where the image URL is not defined', () => {
    expect(
      pdpTransformers.mapFlexibleBundleProduct(
        {
          bundleDetailsForm0: {
            products: [
              {
                imgFullImg: null,
              },
            ],
          },
        },
        0
      ).assets
    ).toEqual([])
  })

  it('handles the case where the image URL is not a String', () => {
    expect(
      pdpTransformers.mapFlexibleBundleProduct(
        {
          bundleDetailsForm0: {
            products: [
              {
                imgFullImg: {},
              },
            ],
          },
        },
        0
      ).assets
    ).toEqual([])
  })
})

describe('#mergeAndMapBundleItems', () => {
  it('returns empty array if invalid arguments provided', () => {
    expect(pdpTransformers.mergeAndMapBundleItems()).toEqual([])
    expect(pdpTransformers.mergeAndMapBundleItems('a')).toEqual([])
    expect(pdpTransformers.mergeAndMapBundleItems({ a: 'a' })).toEqual([])
  })

  it('returns empty array if argument is empty array', () => {
    expect(pdpTransformers.mergeAndMapBundleItems([])).toEqual([])
  })

  it('returns an empty array if the bundleSlots array is empty', () => {
    expect(pdpTransformers.mergeAndMapBundleItems([])).toEqual([])
  })

  it('returns and empty array if the bundleSlots contains objects without product properties', () => {
    expect(pdpTransformers.mergeAndMapBundleItems(['a'])).toEqual([])
    expect(pdpTransformers.mergeAndMapBundleItems(['a', 'b'])).toEqual([])
  })

  it('returns an empty array if the products do not contain any items', () => {
    expect(
      pdpTransformers.mergeAndMapBundleItems([
        { product: 'abc' },
        { product: [] },
        { product: [{ items: false }] },
      ])
    ).toEqual([])
  })

  it('returns the expected result when the bundleSlots array contains the right information', () => {
    expect(
      pdpTransformers.mergeAndMapBundleItems([
        {
          product: [
            {
              items: [
                {
                  partNumber: 26934194,
                  availableInventory: 10,
                  skuSequence: 1,
                  attrValue_1: '4',
                  lowStock: false,
                },
                {
                  partNumber: 26934200,
                  availableInventory: 8,
                  skuSequence: 2,
                  attrValue_1: '6',
                  lowStock: false,
                },
              ],
            },
          ],
        },
        {
          product: [
            {
              items: [
                {
                  partNumber: 26938000,
                  availableInventory: 6,
                  skuSequence: 1,
                  attrValue_2: '4',
                  lowStock: false,
                },
              ],
            },
          ],
        },
      ])
    ).toEqual([
      { sku: '26934194', size: '4', quantity: 10, selected: false },
      { sku: '26934200', size: '6', quantity: 8, selected: false },
      { sku: '26938000', size: '4', quantity: 6, selected: false },
    ])
  })
})

describe('#mergeAndMapFlexibleBundleItems', () => {
  it('returns empty array for invalid arguments', () => {
    expect(pdpTransformers.mergeAndMapFlexibleBundleItems()).toEqual([])
    expect(pdpTransformers.mergeAndMapFlexibleBundleItems('a')).toEqual([])
    expect(pdpTransformers.mergeAndMapFlexibleBundleItems({ a: 'a' })).toEqual(
      []
    )
  })

  it('manages correctly bundle slot with unexpected shape', () => {
    expect(pdpTransformers.mergeAndMapFlexibleBundleItems(['a'])).toEqual([])
  })

  it('returns expected array of items', () => {
    const bundleSlots = wcsFlexibleBundle.BundleDetails.bundleSlots
    expect(pdpTransformers.mergeAndMapFlexibleBundleItems(bundleSlots)).toEqual(
      hapiFlexibleBundle.items
    )
  })
})

describe('#mapFlexibleBundleProduct', () => {
  it('returns empty object for invalid arguments', () => {
    expect(pdpTransformers.mapFlexibleBundleProduct()).toEqual({})
    expect(pdpTransformers.mapFlexibleBundleProduct({})).toEqual({})
    expect(pdpTransformers.mapFlexibleBundleProduct({}, 'a')).toEqual({})
  })

  it('returns expected object in case of valid arguments and "bundleProduct" in unexpected format', () => {
    expect(pdpTransformers.mapFlexibleBundleProduct({}, 1)).toEqual({})
  })

  it('returns expected object ', () => {
    const bundleProductWCS = wcsFlexibleBundle.BundleDetails.bundleSlots[0]
    const bundleProductHapi = hapiFlexibleBundle.bundleProducts[0]
    expect(
      pdpTransformers.mapFlexibleBundleProduct(bundleProductWCS, 1)
    ).toEqual({
      productId: bundleProductHapi.productId,
      grouping: bundleProductHapi.grouping,
      lineNumber: bundleProductHapi.lineNumber,
      name: bundleProductHapi.name,
      description: bundleProductHapi.description,
      wasWasPrice: bundleProductHapi.wasWasPrice,
      wasPrice: bundleProductHapi.wasPrice,
      unitPrice: bundleProductHapi.unitPrice,
      stockEmail: false,
      storeDelivery: false,
      stockThreshold: bundleProductHapi.stockThreshold,
      wcsColourKey: bundleProductHapi.wcsColourKey,
      wcsSizeKey: bundleProductHapi.wcsSizeKey,
      assets: bundleProductHapi.assets,
      items: bundleProductHapi.items,
      bundleProducts: [],
      attributes: bundleProductHapi.attributes,
      colourSwatches: bundleProductHapi.colourSwatches,
      tpmLinks: bundleProductHapi.tpmLinks,
      bundleSlots: bundleProductHapi.bundleSlots,
      ageVerificationRequired: bundleProductHapi.ageVerificationRequired,
      isBundleOrOutfit: bundleProductHapi.isBundleOrOutfit,
    })
  })

  it('return the correct wasPrice when WCS send only the was1Price', () => {
    const wcsBundlePrd = clone(wcsFlexibleBundle.BundleDetails.bundleSlots[0])
    // Emulate with no was2Price param
    delete wcsBundlePrd.bundleDetailsForm1.products[0].was2Price
    const transformedProduct = pdpTransformers.mapFlexibleBundleProduct(
      wcsBundlePrd,
      1
    )
    expect(transformedProduct.unitPrice).toBe('18.00')
    expect(transformedProduct.wasPrice).toBe('22.00')
  })

  it('return the correct wasPrice when WCS send only the was2Price', () => {
    const wcsBundlePrd = clone(wcsFlexibleBundle.BundleDetails.bundleSlots[0])
    // Emulate with no was2Price param
    delete wcsBundlePrd.bundleDetailsForm1.products[0].was1Price
    const transformedProduct = pdpTransformers.mapFlexibleBundleProduct(
      wcsBundlePrd,
      1
    )
    expect(transformedProduct.unitPrice).toBe('18.00')
    expect(transformedProduct.wasPrice).toBe('20.00')
  })

  it('maps Amplience images', () => {
    const baseImageUrl = 'http://some-url'
    expect(
      pdpTransformers.mapFlexibleBundleProduct(
        {
          bundleDetailsForm0: {
            products: [
              {
                baseImageUrl,
              },
            ],
          },
        },
        0
      ).amplienceAssets.images
    ).toEqual([baseImageUrl])
  })

  it('maps Amplience video', () => {
    const baseVideoUrl = 'http://some-video-url'
    expect(
      pdpTransformers.mapFlexibleBundleProduct(
        {
          bundleDetailsForm0: {
            products: [
              {
                baseVideoUrl,
              },
            ],
          },
        },
        0
      ).amplienceAssets.video
    ).toEqual(baseVideoUrl)
  })

  it('does not add Amplience assets if no image and video are present', () => {
    expect(
      pdpTransformers.mapFlexibleBundleProduct(
        {
          bundleDetailsForm0: {
            products: [{}],
          },
        },
        0
      ).amplienceAssets
    ).toBeUndefined()
  })
})

describe('#mapFixedBundleProduct', () => {
  it('maps baseImageUrl', () => {
    const baseImageUrl = 'bar'

    const { amplienceAssets } = pdpTransformers.mapFixedBundleProduct(
      { baseImageUrl },
      0
    )

    expect(amplienceAssets.images).toEqual([baseImageUrl])
  })
})

describe('mapNoBundle', () => {
  it('no thumbnails', () => {
    expect(pdpTransformers.mapNoBundle(wcsNoThumbnails)).toEqual(
      expect.objectContaining(hapiNoThumbnails)
    )
  })
  describe('cms espots', () => {
    it('returns an object with a CEProductEspotCol1Pos1 property', () => {
      expect(
        pdpTransformers.mapNoBundle(wcsPdpResponseExample).espots
          .CEProductEspotCol1Pos1
      ).toEqual('mobilePDPESpotPos2')
    })
  })
  describe('amplience assets', () => {
    it('does not include amplience assets', () => {
      const result = pdpTransformers.mapNoBundle(wcs)
      expect(result.amplienceAssets).toBeFalsy()
    })

    it('includes amplience assets', () => {
      const baseImageUrl1 = 'http://some-image-1'
      const baseImageUrl2 = 'http://some-image-2'
      const baseVideoUrl = 'http://some-video'
      const wcsWithAmplience = clone(wcs)
      wcsWithAmplience.productData.assets.Thumbnailimageurls = [
        { baseImageUrl: baseImageUrl1, normal: '', bundleCatentryId: null },
        { baseImageUrl: baseImageUrl2, normal: '', bundleCatentryId: null },
        { baseImageUrl: baseImageUrl2, normal: '', bundleCatentryId: 123 },
        { baseVideoUrl, normal: '', bundleCatentryId: null },
      ]

      const { amplienceAssets } = pdpTransformers.mapNoBundle(wcsWithAmplience)

      expect(amplienceAssets).toEqual({
        images: [baseImageUrl1, baseImageUrl2],
        video: baseVideoUrl,
      })
    })
  })

  it('maps breadcrumb', () => {
    const firstLevelCategoryName = 'first level'
    const firstLevelCategoryDisplayURL = 'url1'
    const name = 'product name'
    const { breadcrumbs } = pdpTransformers.mapNoBundle({
      firstLevelCategoryName,
      firstLevelCategoryDisplayURL,
      productData: {
        name,
      },
    })
    expect(breadcrumbs).toEqual([
      { label: 'Home', url: '/' },
      { label: firstLevelCategoryName, url: firstLevelCategoryDisplayURL },
      { label: name },
    ])
  })

  it('maps iscmCategory attribute', () => {
    const productWithIscmCatepory = clone(wcs)
    productWithIscmCatepory.productData.iscmCategory = 'foo'
    expect(
      pdpTransformers.mapNoBundle(productWithIscmCatepory).iscmCategory
    ).toBe('foo')
  })

  it('maps notifyMe property', () => {
    const result = pdpTransformers.mapNoBundle({
      productData: { notifyMe: 'Y' },
    })
    expect(result.notifyMe).toBeTruthy()
  })

  it('maps isDDPProduct property', () => {
    const result = pdpTransformers.mapNoBundle({
      isDDPProduct: true,
    })
    expect(result.isDDPProduct).toBe(true)
  })

  describe('metaDescription property', () => {
    const metaDescription = 'meta description'
    const metaDescriptionFromBody = 'body meta description'

    it('maps meta description from productData (backward compatility while the property is being moved)', () => {
      const result = pdpTransformers.mapNoBundle({
        productData: { metaDescription },
      })
      expect(result.metaDescription).toBe(metaDescription)
    })

    it('maps meta description from body', () => {
      const result = pdpTransformers.mapNoBundle({
        metaDescription: metaDescriptionFromBody,
        productData: { metaDescription },
      })
      expect(result.metaDescription).toBe(metaDescriptionFromBody)
    })
  })

  it('maps pageTitle', () => {
    const pageTitle = 'foo bar'
    const result = pdpTransformers.mapNoBundle({
      pageTitle,
    })
    expect(result.pageTitle).toBe(pageTitle)
  })

  it('return the correct totalMarkdownValue when WCS send only the was1PriceDiff', () => {
    const transformedProduct = pdpTransformers.mapNoBundle(
      wcsPdpResponseExample
    )
    expect(transformedProduct.totalMarkdownValue).toBe('10.00')
  })

  it('includes the bnpl object', () => {
    const result = pdpTransformers.mapNoBundle({
      ...wcs,
      productData: {
        ...wcs.productData,
        prices: {
          ...wcs.productData.prices,
          nowPrice: 20,
        },
      },
    })

    expect(result.bnplPaymentOptions).toEqual({
      clearpay: {
        amount: '5.00',
        instalments: 4,
      },
      klarna: {
        amount: '6.67',
        instalments: 3,
      },
    })
  })
})

describe('mapBundle for common bundle attributes', () => {
  it('maps pageTitle', () => {
    const pageTitle = 'foo bar'
    const bundleWithSeoTitle = { ...wcsFixedBundle, pageTitle }
    const result = pdpTransformers.mapBundle(bundleWithSeoTitle)
    expect(result.pageTitle).toBe(pageTitle)
  })

  it('maps iscmCategory attribute', () => {
    const bundleWithIscmCatepory = { ...wcsFixedBundle, iscmCategory: 'foo' }
    expect(pdpTransformers.mapBundle(bundleWithIscmCatepory).iscmCategory).toBe(
      'foo'
    )
  })

  it('maps meta description', () => {
    const metaDescription = 'meta description'
    const result = pdpTransformers.mapBundle({
      BundleDetails: { nowPrice: 0, metaDescription },
    })
    expect(result.metaDescription).toBe(metaDescription)
  })
})

describe('mapFixedBundle', () => {
  it('should return correct bundle data and format', () => {
    expect(pdpTransformers.mapFixedBundle(wcsFixedBundle)).toEqual(
      hapiFixedBundle
    )
  })

  describe('amplience assets', () => {
    it('does not include Amplience assets if they are not returned by WCS', () => {
      expect(pdpTransformers.mapFlexibleBundle(wcsFlexibleBundle)).toEqual(
        hapiFlexibleBundle
      )
    })

    it('includes amplience images and video', () => {
      const baseImageUrl1 = 'http://some-image-1'
      const baseImageUrl2 = 'http://some-image-2'
      const baseVideoUrl = 'http://some-video'
      const wcsFixedBundleWithAmplience = clone(wcsFixedBundle)
      wcsFixedBundleWithAmplience.assets.Thumbnailimageurls = [
        { baseImageUrl: baseImageUrl1, normal: '', bundleCatentryId: null },
        { baseImageUrl: baseImageUrl2, normal: '', bundleCatentryId: null },
        { baseVideoUrl, normal: '', bundleCatentryId: null },
      ]

      const result = pdpTransformers.mapFixedBundle(wcsFixedBundleWithAmplience)

      expect(result.amplienceAssets).toEqual({
        images: [baseImageUrl1, baseImageUrl2],
        video: baseVideoUrl,
      })
    })

    it('includes the bnpl object', () => {
      const result = pdpTransformers.mapFlexibleBundle(wcsFlexibleBundle)

      expect(result.bnplPaymentOptions).toEqual({
        clearpay: {
          amount: '8.00',
          instalments: 4,
        },
        klarna: {
          amount: '10.67',
          instalments: 3,
        },
      })
    })
  })
})

describe('mapFlexibleBundle', () => {
  it('should return correct bundle data and format', () => {
    const bundleObject = pdpTransformers.mapFlexibleBundle(wcsFlexibleBundle)
    expect(bundleObject).toEqual(hapiFlexibleBundle)
  })

  describe('amplience assets', () => {
    const wcsFlexibleBundleWithAmplience = clone(wcsFlexibleBundle)
    wcsFlexibleBundleWithAmplience.assets.Thumbnailimageurls = wcsFlexibleBundleWithAmplience.assets.Thumbnailimageurls.map(
      (asset) => ({ ...asset, baseImageUrl: 'mocked-amplience-url' })
    )

    it('does not include amplience assets', () => {
      const result = pdpTransformers.mapFlexibleBundle(wcsFlexibleBundle)
      expect(result.amplienceAssets).toBeFalsy()
    })

    it('includes amplience assets', () => {
      const result = pdpTransformers.mapFlexibleBundle(
        wcsFlexibleBundleWithAmplience
      )
      expect(result.amplienceAssets).toBeTruthy()
    })
  })

  it('includes the bnpl object', () => {
    const bundleObject = pdpTransformers.mapFlexibleBundle(wcsFlexibleBundle)

    expect(bundleObject.bnplPaymentOptions).toEqual({
      clearpay: {
        amount: '8.00',
        instalments: 4,
      },
      klarna: {
        amount: '10.67',
        instalments: 3,
      },
    })
  })
})

describe('mapBreadcrumbs', () => {
  it('maps home and product name', () => {
    const productName = 'product name'
    expect(pdpTransformers.mapBreadcrumbs({}, productName)).toEqual([
      { label: 'Home', url: '/' },
      { label: productName },
    ])
  })

  it('maps first level category', () => {
    const firstLevelCategoryName = 'cat 1'
    const firstLevelCategoryDisplayURL = 'url 1'
    const body = {
      firstLevelCategoryName,
      firstLevelCategoryDisplayURL,
    }
    expect(pdpTransformers.mapBreadcrumbs(body)).toEqual([
      { label: 'Home', url: '/' },
      { label: firstLevelCategoryName, url: firstLevelCategoryDisplayURL },
    ])
  })

  it('maps second level category', () => {
    const secondLevelCategoryName = 'cat 2'
    const secondLevelCategoryDisplayURL = 'url 2'
    const body = {
      secondLevelCategoryName,
      secondLevelCategoryDisplayURL,
    }
    expect(pdpTransformers.mapBreadcrumbs(body)).toEqual([
      { label: 'Home', url: '/' },
      { label: secondLevelCategoryName, url: secondLevelCategoryDisplayURL },
    ])
  })

  it('maps all breadcrumbs', () => {
    const firstLevelCategoryName = 'cat 1'
    const firstLevelCategoryDisplayURL = 'url 1'
    const secondLevelCategoryName = 'cat 2'
    const secondLevelCategoryDisplayURL = 'url 2'
    const body = {
      firstLevelCategoryName,
      firstLevelCategoryDisplayURL,
      secondLevelCategoryName,
      secondLevelCategoryDisplayURL,
    }
    expect(pdpTransformers.mapBreadcrumbs(body)).toEqual([
      { label: 'Home', url: '/' },
      { label: firstLevelCategoryName, url: firstLevelCategoryDisplayURL },
      { label: secondLevelCategoryName, url: secondLevelCategoryDisplayURL },
    ])
  })
})

describe('see more text and value should be passed unchanged', () => {
  const products = [
    ['normal product', pdpTransformers.mapNoBundle, wcsPdpResponseExample],
    ['fixed bundle', pdpTransformers.mapFixedBundle, wcsFixedBundle],
    ['flexible bundle', pdpTransformers.mapFlexibleBundle, wcsFlexibleBundle],
  ]

  products.forEach(([desc, fn, wcsResp]) => {
    it(`see more for ${desc}`, () => {
      expect(fn(wcsResp).seeMoreText).toBe(wcsResp.seeMoreText)
      expect(fn(wcsResp).seeMoreValue).toBe(wcsResp.seeMoreValue)
    })

    it(`no see more for ${desc}`, () => {
      const seemoreLessResp = omit(['seeMoreText', 'seeMoreValue'], wcsResp)
      expect(fn(seemoreLessResp).seeMoreText).toBe(undefined)
      expect(fn(seemoreLessResp).seeMoreValue).toBe(undefined)
    })
  })
})
