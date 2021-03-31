import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Image from '../../common/Image/Image'
import Price from '../../common/Price/Price'
import { PrivacyGuard } from '../../../lib'

export default class OrderHistoryOrder extends Component {
  static propTypes = {
    lineNo: PropTypes.string,
    returnQuantity: PropTypes.number,
    size: PropTypes.string,
    discount: PropTypes.string,
    total: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  createOptionsForDisplay() {
    const { l } = this.context
    const { lineNo, returnQuantity, size, discount, total } = this.props

    const parsedDiscount = discount ? parseFloat(discount) : 0
    const parsedTotal = parseFloat(total) - parsedDiscount

    return [
      [
        {
          text: l`Item code`,
          value: lineNo,
          className: 'ReturnHistoryOrder-text ReturnHistoryOrder-line-no',
        },
        { text: l`Size`, value: size, className: 'ReturnHistoryOrder-text' },
        {
          text: l`Quantity`,
          value: returnQuantity,
          className: 'ReturnHistoryOrder-text',
        },
      ],
      [
        {
          text: l`Item price`,
          value: parsedTotal,
          className: 'ReturnHistoryOrder-text',
          price: true,
        },
      ],
      [
        {
          text: l`Item discount`,
          value: discount,
          className: 'ReturnHistoryOrder-text ReturnHistoryOrder-item-discount',
          price: true,
        },
      ],
      [
        {
          text: l`Total credited`,
          value: total,
          className: 'ReturnHistoryOrder-text',
          price: true,
        },
      ],
    ]
  }

  createContent(options) {
    const content = options.map((option, index) => {
      const { value, text, price, className } = option

      return value || value === 0 ? (
        <p
          className={className}
          key={index} // eslint-disable-line react/no-array-index-key
        >
          {price ? (
            <span>
              {text}: <Price price={value} privacyProtected />
            </span>
          ) : (
            <PrivacyGuard>
              <span>
                {text}: {value}
              </span>
            </PrivacyGuard>
          )}
        </p>
      ) : null
    })
    return content
  }

  createHeader() {
    const { name } = this.props
    return (
      <h2 className="ReturnHistoryOrder-text ReturnHistoryOrder-productName">
        {name}
      </h2>
    )
  }

  createContentOuter(options) {
    const header = this.createHeader()
    const content = options.map((option, index) => {
      const className = 'ReturnHistoryOrder-cont'
      return index === 0 ? (
        <div
          className={className}
          key={index} // eslint-disable-line react/no-array-index-key
        >
          {header}
          {this.createContent(option)}
        </div>
      ) : (
        <div
          className={className}
          key={index} // eslint-disable-line react/no-array-index-key
        >
          {this.createContent(option)}
        </div>
      )
    })

    return content
  }

  render() {
    const { imageUrl, name } = this.props
    const optionsForContent = this.createOptionsForDisplay()
    const content = this.createContentOuter(optionsForContent)

    return (
      <section className="ReturnHistoryOrder">
        <Image className="ReturnHistoryOrder-image" src={imageUrl} alt={name} />
        <div className="ReturnHistoryOrder-content">{content}</div>
      </section>
    )
  }
}
