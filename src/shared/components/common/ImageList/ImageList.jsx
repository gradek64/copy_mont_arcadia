import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Image from '../Image/Image'

@connect((state) => ({
  inCheckout: state.routing.location.pathname.startsWith('/checkout'),
}))
class ImageList extends Component {
  static propTypes = {
    columns: PropTypes.number,
    images: PropTypes.array,
    margin: PropTypes.string,
    inCheckout: PropTypes.bool,
  }

  renderImage = ({ link, source, alt, target }) => {
    const { columns, inCheckout } = this.props
    const linkStyle = { flexBasis: `${100 / columns}%` }

    if (inCheckout) {
      target = '_blank'
    }

    const image = <Image className="ImageList-image" src={source} alt={alt} />

    if (link) {
      return link.startsWith('http') ? (
        <a
          href={link}
          target={target}
          key={source}
          style={linkStyle}
          className="ImageList-link"
        >
          {image}
        </a>
      ) : (
        <Link
          to={link}
          className="ImageList-link"
          target={target}
          style={linkStyle}
          key={source}
        >
          {image}
        </Link>
      )
    }

    return (
      <div key={source} style={linkStyle} className="ImageList-link">
        {image}
      </div>
    )
  }

  render() {
    const { margin } = this.props
    return (
      <div style={{ margin }} className="ImageList">
        {this.props.images.map(this.renderImage)}
      </div>
    )
  }
}

export default ImageList
