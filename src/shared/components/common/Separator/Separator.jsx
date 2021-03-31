import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class Separator extends Component {
    static propTypes = {
        className: PropTypes.string,
        backgroundColor: PropTypes.string,
        margin: PropTypes.string,
    }

    static defaultProps = {
        className: '',
        backgroundColor: '#e1e1e1',
        margin: '30px 0',
    }

    render() {
        const { className, backgroundColor, margin } = this.props
        return <hr className={className} style={
            {
                border: 'none',
                height: '1px',
                backgroundColor,
                margin,
            }
        } />
    }
}
