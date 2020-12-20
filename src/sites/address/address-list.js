import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import * as actionCreators from './../../app/actioncreators'
import Loading from '../../app/loader'

class AddressList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: false, addressList: [], billing_address: "", shipping_address: ""}
		this.loadAddresses = this.loadAddresses.bind(this)
	}

	componentDidMount() {
		this.loadAddresses()
	}

	loadAddresses() {
		const { loading } = this.state
		const { actions, history } = this.props
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		actions.getAddresses()
			.then(res => {
				let response = res.data
				console.log(response)
				this.setState({loading: false, response: false, addressList: response.data})
			})
	}	

	handleOnChange = (e) => {
		e.persist();
		this.setState(() => ({
			[e.target.name]: e.target.value 
		}))
	}

	onSubmit = (e) => {
		const { actions, history } = this.props
		const { billing_address, shipping_address } = this.state
		e.preventDefault()
		console.log(billing_address, shipping_address)
		localStorage.setItem("billing_address", billing_address);
		localStorage.setItem("shipping_address", shipping_address);
		console.log(localStorage.getItem("billing_address"))
	}

	displayAddresses(address_type) {
		const { addressList } = this.state
		let rows = []
		addressList.forEach((address, index) => {
			rows.push(<div class='row'>
				<div class="col-1">
					<input type="radio" name={address_type} value={ address.id } onChange={this.handleOnChange} />
				</div>
				<div class="card address-card">
					<div class="card-body">
					<h4 class="card-title">{ address.address_line1 }</h4>
						<br/>
					</div>
				</div>
			</div>)
		})
		return rows
	}

	render() {
		const { loading } = this.state
		return (
			<div className="container">
				{ loading ? <Loading /> : <div className="row my-2">
					<div class="container">
						<div class='info-2-5'>Addresses 
							<Link class="btn btn-primary float-right add-new" to="/address-add">Add a New Address</Link>
							<hr/>
						</div>
						<form onSubmit={this.onSubmit}>
							<div class="row">
								<div class="col-6">
									<div class="info-1-5">Select Billing Address</div>
									{ this.displayAddresses("billing_address") }
								</div>

								<div class="col-6">
									<div class="info-1-5">Select Shipping Address</div>
									{ this.displayAddresses("shipping_address") }
								</div>
							</div>
							<div class="text-center"><button class="btn btn-primary select-address" type="submit">Select Addresses</button></div>
						</form>
					</div>
				</div> }
			</div>
		)
	}
}

AddressList.propTypes = {
	cart: PropTypes.object
}

const AddressListWithRouter = withRouter(AddressList)

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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddressListWithRouter)