import {
  buildComponentRender,
  shallowRender,
} from '../../../../../../test/unit/helpers/test-component'

import Footer from '../Footer'
import Column from '../Column'

const requiredProps = {
  category: {
    columns: [
      {
        subcategories: {
          0: {
            newIn: [
              { image: { span: 'footer' } },
              { label: 'something to buy' },
            ],
          },
        },
      },
      {
        subcategories: {
          0: {
            jeans: [{ image: { span: 'footer' } }, { label: 'blue jeans' }],
            0: [{ image: { span: 1 } }, { label: 'red jeans' }],
          },
        },
      },
      {
        subcategories: {
          0: {
            socks: [{ label: 'winter socks' }],
            jeans: [{ image: { url: '' } }],
          },
        },
      },
    ],
    url: 'http://www.topman.com',
  },
  hideMegaNav: () => {},
}

const filterColumnsProps = {
  category: {
    categoryId: '2244743',
    url: '/en/tsuk/category/brands-4210405',
    label: 'Brands',
    redirectionUrl: '',
    totalcolumns: 4,
    columns: [
      {
        span: '1',
        subcategories: [
          {
            'SHOP BY CATEGORY': [
              {
                categoryId: '2258006',
                url: '/en/tsuk/category/brands-4210405/beauty-brands-4233544',
                label: 'Beauty Brands',
                redirectionUrl: '',
              },
              {
                paddingTop: '',
                isHidden: false,
                bold: false,
                sale: false,
                image: {
                  width: 1110,
                  openNewWindow: true,
                  height: 140,
                  span: 'footer',
                  url:
                    '/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color7/cms/pages/json/json-0000139861/images/BRANDS_LOGOS2.png',
                },
                categoryId: '3500058',
                url:
                  '/en/tsuk/category/brands-4210405/top-nav-shop-all-brands-7323864',
                label: 'Top Nav - Shop All Brands',
                redirectionUrl: '',
              },
            ],
          },
        ],
      },
      {
        span: '2',
        subcategories: [
          {
            '': [
              {
                categoryId: '3291092',
                url: '/en/tsuk/category/brands-4210405/ivy-park-5834347',
                label: 'Ivy Park',
                redirectionUrl:
                  '/en/tsuk/category/clothing-427/ivy-park-5463599?cat1=203984&cat2=3281520',
              },
              {
                categoryId: '3406848',
                url: '/en/tsuk/category/brands-4210405/adidas-6008354',
                label: 'adidas',
                redirectionUrl: '',
              },
            ],
          },
        ],
      },
    ],
  },
  hideMegaNav: () => {},
}

const filterColumnsExpected = {
  span: '1',
  subcategories: [
    {
      '': [
        {
          paddingTop: '',
          isHidden: false,
          bold: false,
          sale: false,
          image: {
            width: 1110,
            openNewWindow: true,
            height: 140,
            span: 4,
            url:
              '/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color7/cms/pages/json/json-0000139861/images/BRANDS_LOGOS2.png',
          },
          categoryId: '3500058',
          url:
            '/en/tsuk/category/brands-4210405/top-nav-shop-all-brands-7323864',
          label: 'Top Nav - Shop All Brands',
          redirectionUrl: '',
        },
      ],
    },
  ],
}

describe('<Footer />', () => {
  const renderComponent = buildComponentRender(shallowRender, Footer)

  it('should render with two footer columns', () => {
    expect(renderComponent(requiredProps).getTree()).toMatchSnapshot()
  })

  it('returns nothing if has no columns passed', () => {
    const { wrapper } = renderComponent({
      ...requiredProps,
      category: { columns: [] },
    })
    expect(wrapper.find(Column)).toHaveLength(0)
  })

  it('returns Columns with correctly filtered columns passed to Footer', () => {
    const { wrapper } = renderComponent(filterColumnsProps)
    expect(wrapper.find(Column).get(0).props.column).toMatchObject(
      filterColumnsExpected
    )
  })
})
