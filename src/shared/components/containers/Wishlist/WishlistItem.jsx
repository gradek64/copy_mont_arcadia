import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Image from '../../../components/common/Image/Image'
import Select from '../../../components/common/FormComponents/Select/Select'
import Button from '../../../components/common/Button/Button'
import Message from '../../common/FormComponents/Message/Message'
import HistoricalPrice from '../../../components/common/HistoricalPrice/HistoricalPrice'
import ProductQuickViewButton from '../../../components/common/ProductQuickViewButton/ProductQuickViewButton'
import Form from '../../common/FormComponents/Form/Form'

import { isCountryExcluded } from '../../../selectors/productSelectors'

const IMAGE_PREFERENCE_ORDER = [
  'IMAGE_OUTFIT_NORMAL',
  'IMAGE_OUTFIT_LARGE',
  'IMAGE_OUTFIT_SMALL',
]

@connect((state, { item }) => ({
  isCountryExcluded: isCountryExcluded(state, item),
}))
class WishlistItem extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    handleAddToBag: PropTypes.func.isRequired,
    grid: PropTypes.number.isRequired,
    handleQuickView: PropTypes.func.isRequired,
    handleSizeChange: PropTypes.func.isRequired,
    baseUrlPath: PropTypes.string.isRequired,
    selectedCatEntryId: PropTypes.string,
    sizeValidationError: PropTypes.bool,
    handleLinkClick: PropTypes.func.isRequired,
    isCountryExcluded: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  static defaultProps = {
    isCountryExcluded: '',
  }

  render() {
    const {
      item = {},
      grid,
      handleAddToBag,
      handleQuickView,
      handleSizeChange,
      handleRemoveFromWishlist,
      selectedCatEntryId,
      baseUrlPath,
      sizeValidationError,
      handleLinkClick,
      isAddingToBag,
      brandName,
      isCountryExcluded,
    } = this.props
    const { l, p } = this.context
    const { sizeAndQuantity } = item

    let availableQuantity = 0
    const options = Array.isArray(sizeAndQuantity)
      ? sizeAndQuantity.reduce((acc, size) => {
          availableQuantity += size.quantity
          if (size.quantity === 0) {
            acc.push({
              value: size.catentryId,
              label: `${l`Size`} ${size.size}: ${l`Out of stock`}`,
              disabled: true,
            })
          } else {
            acc.push({
              value: size.catentryId,
              label: `${l`Size`} ${size.size}`,
            })
          }
          return acc
        }, [])
      : []
    const productPath = `${baseUrlPath}/${l`product`}/${item.parentProductId}`
    const { parentProductId, price = {}, lineNumber } = item
    const { nowPrice, was1Price, was2Price } = price
    const productDetails = {
      price: p(nowPrice, true).value,
      lineNumber,
    }
    const ctaButtonActive =
      isAddingToBag &&
      isAddingToBag.item === parentProductId &&
      isAddingToBag.loading
    const getImageUrl = (item) => {
      const { assets, outfitImageUrl } = item
      if (!assets || !assets.length) return outfitImageUrl

      const image =
        IMAGE_PREFERENCE_ORDER.reduce((selected, targetType) => {
          return (
            selected || assets.find(({ assetType }) => assetType === targetType)
          )
        }, null) || assets[0]

      return image.url
    }

    const isOutOfStock = availableQuantity <= 0

    return (
      <li className={`WishlistItem WishlistItem--col${grid}`}>
        <Link
          onClick={handleLinkClick}
          className="WishlistItem-imageLink"
          to={productPath}
        >
          <Image className="WishlistItem-image" src={getImageUrl(item)} />
        </Link>
        <button
          className="WishlistItem-remove"
          onClick={() =>
            handleRemoveFromWishlist(parentProductId, productDetails)
          }
        />
        <div className="WishlistItem-titleAndPriceSection">
          <div className="WishlistItem-titleSection">
            <Link
              onClick={handleLinkClick}
              className="WishlistItem-title"
              to={productPath}
            >
              <p className="WishlistItem-titleText">{item.title}</p>
            </Link>
            <div className="WishlistItem-quickViewIcon">
              <ProductQuickViewButton
                onClick={() => handleQuickView(parentProductId)}
              />
            </div>
          </div>
          <HistoricalPrice
            className="WishlistItem-price"
            brandName={brandName}
            price={nowPrice}
            wasPrice={was1Price}
            wasWasPrice={was2Price}
          />
        </div>
        <Form
          className="WishlistItem-form AddToBag"
          onSubmit={(e) => handleAddToBag(e, parentProductId, productDetails)}
        >
          <Select
            isDisabled={isOutOfStock}
            className="WishlistItem-select"
            firstDisabled={options.length > 1 ? l`Select size` : ''}
            options={options}
            onChange={(e) => handleSizeChange(e, parentProductId)}
            name="Size selection"
            value={selectedCatEntryId}
            isRequired
          />
          {sizeValidationError && (
            <Message
              className={'WishlistItem-sizeValidationError'}
              message={l`Please select your size to continue`}
              type={'error'}
            />
          )}
          {isOutOfStock ? (
            <Message message={l`Product is out of stock`} type={'error'} />
          ) : (
            <Button
              className="WishlistItem-button"
              isActive={!!selectedCatEntryId}
              clickHandler={(e) =>
                handleAddToBag(e, parentProductId, productDetails)
              }
              isDisabled={ctaButtonActive || isCountryExcluded}
            >
              {ctaButtonActive ? (
                [
                  <span className="translate">{l`Adding to bag`}</span>,
                  <span key="animation translate" className="ellipsis" />,
                ]
              ) : (
                <span className="translate">{l`Add to bag`}</span>
              )}
            </Button>
          )}
        </Form>
      </li>
    )
  }
}

export default WishlistItem
