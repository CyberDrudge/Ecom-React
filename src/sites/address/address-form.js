import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import * as actionCreators from './../../app/actioncreators'
import Loading from '../../app/loader'

class AddressForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = { loading: false, name: '', address_line1: '', address_line2: '', city: '', country: '', state: '', postal_code: '' }
	}

	handleOnChange = (e) => {
		e.persist();
		this.setState(() => ({
			[e.target.name]: e.target.value 
		}))
	}

	onSubmit = (e) => {
		const { actions, history } = this.props
		e.preventDefault()
		actions.addAddress(this.state)
			.then(res => {
				if (res.type == "success") {
					console.log(res)
					this.setState({loading: false})
					history.push({pathname: "/"})
				} else {
					this.setState({loading: false})
				}
			})
	}

	displayAddressForm() {
		return (<form onSubmit={this.onSubmit} class="container">
			<div class="info-2-5">Add Your Address</div>
			<div class="secondary">
				<div class="required-field form-item">
					<label>Name: </label>
					<input class="form-control form-input" id="name" formControlName="name" value={this.state.name} name="name" onChange={this.handleOnChange}/>
				</div>
				<div class="required-field form-item">
					<label class="cus-form-label">Address Line 1:</label>
					<input class="form-control form-input" id="address_line1" formControlName="address_line1" value={this.state.address_line1} name="address_line1" onChange={this.handleOnChange}/>
				</div>
				<div class="form-item">
					<label class="cus-form-label">Address Line 2:</label>
					<input class="form-control form-input" id="address_line2" formControlName="address_line2" value={this.state.address_line2} name="address_line2" onChange={this.handleOnChange}/>
				</div>
				<div class="form-item">
					<label class="cus-form-label">City:</label>
					<input class="form-control form-input" id="city" formControlName="city" value={this.state.city} name="city" onChange={this.handleOnChange}/>
				</div>
				<div class="form-item">
					<label class="cus-form-label">State:</label>
					<input class="form-control form-input" id="state" formControlName="state" value={this.state.state} name="state" onChange={this.handleOnChange}/>
				</div>
				<div class="form-item">
					<label class="cus-form-label">Country:</label>
					<input class="form-control form-input" id="country" formControlName="country" value={this.state.country} name="country" onChange={this.handleOnChange}/>
				</div>
				<div class="form-item">
					<label class="cus-form-label">Postal Code:</label>
					<input class="form-control form-input" id="postal_code" formControlName="postal_code" value={this.state.postal_code} name="postal_code" onChange={this.handleOnChange}/>
				</div>
			</div>
			<button class="btn btn-primary" type="submit">Save</button>
		</form>)
	}

	render() {
		const { loading } = this.state
		return (
			<div className="container">
				{ loading ? <Loading /> : <div className="row my-2">
					<div class="container">
						{ this.displayAddressForm() }
					</div>
				</div> }
			</div>
		)
	}
}

AddressForm.propTypes = {
	cart: PropTypes.object
}

const AddressFormWithRouter = withRouter(AddressForm)

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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddressFormWithRouter)