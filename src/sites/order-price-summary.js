import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as actionCreators from './../app/actioncreators'
import Loading from '../app/loader'
import Coupon from './coupon'

class OrderPriceSummary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: false}
	}

	render() {
		const { loading, isCartEmpty } = this.state
		const { actions, cart } = this.props
		let order = {}
		let code = "CODE"
		let order_item = ""
		let count = 3
		count = count
		return (<div class="col-sm-4 mb-4">
		    <ul class="list-group mb-3 z-depth-1">
			    <li class="list-group-item d-flex justify-content-between lh-condensed">
			        <div>
			        <h6 class="my-0">{ order_item } x { order_item}</h6>
			        </div>
			        <span class="text-muted">${ order_item }</span>
			    </li>
			    <li class="list-group-item d-flex justify-content-between bg-light">
			        <div class="text-success">
			        <h6 class="my-0">Promo code</h6>
			        <small>{ order.coupon }</small>
			        </div>
			        <span class="text-success">-${ order.amount }</span>
			    </li>
			    <li class="list-group-item d-flex justify-content-between">
			        <span>Total (USD)</span>
			        <strong>${ order.get_total }</strong>
			    </li>
		    </ul>
			<Coupon actions={actions} />
		</div>)
	}
}

OrderPriceSummary.propTypes = {
	cart: PropTypes.object
}

const mapStateToProps = (state) => {
	return {
		cart: state.cart
	}
}

const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OrderPriceSummary)
