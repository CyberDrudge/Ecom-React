import React from 'react'
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'
import { trimString } from './helper'
import PropTypes from 'prop-types'

class TrimString extends React.Component {
	constructor(props) {
		super(props)
		this.tooltip = this.tooltip.bind(this)
		this.popover = this.popover.bind(this)
	}
	popover() {
		const { string, title } = this.props
		return <Popover id="popover-positioned-scrolling-bottom" title={title}>
			<p className="px-10 my-10">{string}</p>
		</Popover>
	}
	tooltip() {
		const { string } = this.props
		return <Tooltip id="tooltip-positioned-scrolling-bottom">
			{string}
		</Tooltip>
	}
	render() {
		const { string, length, tooltip, placement } = this.props
		let len = (length && parseInt(length)) || 65
		let trstr = trimString(string, len)
		return <OverlayTrigger
			placement={placement || "bottom"}
			overlay={tooltip ? this.tooltip() : this.popover()}>
			<span className="product-trim">{trstr}</span>
		</OverlayTrigger>
	}
}

TrimString.propTypes = {
	string: PropTypes.string.isRequired,
	placement: PropTypes.string,
	title: PropTypes.string,
	length: PropTypes.number,
	tooltip: PropTypes.bool
}

export default TrimString
