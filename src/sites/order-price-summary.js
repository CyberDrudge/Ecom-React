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
		let order = cart.toJS()
		return (<div className="col-sm-4 mb-4">
		    <ul className="list-group mb-3 z-depth-1">
			    <li className="list-group-item d-flex justify-content-between lh-condensed">
			        <div>
			        <h6 className="my-0">Cart Total</h6>
			        </div>
			        <span className="text-muted">{ order.subtotal }</span>
			    </li>
			    <li className="list-group-item d-flex justify-content-between lh-condensed">
			        <div>
			        <h6 className="my-0">Delivery Charge</h6>
			        </div>
			        <span className="text-muted">+{ order.delivery_charge }</span>
			    </li>
			    {order.coupon && <li className="list-group-item d-flex justify-content-between bg-light">
			        <div className="text-success">
			        <h6 className="my-0">Promo code</h6>
			        <small>{ order.coupon.code }</small>
			        </div>
			        <span className="text-success">-{ order.coupon.amount || 0 }</span>
			    </li>}
			    <li className="list-group-item d-flex justify-content-between">
			        <span>Total</span>
			        <strong>{ order.total }</strong>
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
