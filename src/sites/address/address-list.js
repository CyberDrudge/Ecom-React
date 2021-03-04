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
		const { actions } = this.props
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		actions.getAddresses()
			.then(res => {
				let response = res.data
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
		const { history } = this.props
		const { billing_address, shipping_address } = this.state
		e.preventDefault()
		localStorage.setItem("billing_address", billing_address);
		localStorage.setItem("shipping_address", shipping_address);
		history.push({
			pathname: "/checkout"
		})
	}

	displayAddresses(address_type) {
		const { addressList } = this.state
		let rows = []
		addressList.forEach((address, index) => {
			rows.push(<div className='row'>
				<div className="col-1 card-body">
					<input type="radio" id={address_type+address.id} name={address_type} value={ address.id } onChange={this.handleOnChange} />
				</div>
				<div className="card address-card">
					<label for={address_type+address.id}>
					<div className="card-body">
						<div className=" font20">
							{ address.name } { address.nickname && <span> | { address.nickname }</span> }
						</div>
						<div>
							<span className="font20">{ address.address_line1 }, </span> { address.address_line2 && <span> { address.address_line2 }</span> }
						</div>
						<div>{ address.city }, { address.state }, { address.country }</div>
						<div className="font20">{ address.postal_code }</div>
					</div>
					</label>
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
					<div className="container">
						<div className='info-2-5'>Addresses 
							<Link className="btn btn-primary float-right add-new" to="/address-add">Add a New Address</Link>
							<hr/>
						</div>
						<form onSubmit={this.onSubmit}>
							<div className="row align-left">
								<div className="col-6">
									<div className="info-1-5 my-10">Select Billing Address</div>
									{ this.displayAddresses("billing_address") }
								</div>

								<div className="col-6">
									<div className="info-1-5 my-10">Select Shipping Address</div>
									{ this.displayAddresses("shipping_address") }
								</div>
							</div>
							<div className="text-center"><button className="btn btn-primary select-address" type="submit">Select Addresses</button></div>
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