import React from 'react'
import { Switch, Route, BrowserRouter as Router, Redirect, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Home from './home'
import ProductList from './productlist'
import Login from './login'
import Cart from '../sites/cart'
import Checkout from '../sites/checkout'
import AddressList from '../sites/address/address-list'
import AddressForm from '../sites/address/address-form'

class Main extends React.PureComponent {
	render() {
		// const { history } = this.props
		return <Switch>
			<Route exact path="/" component={Home}/>
			<Route path={`/products`} component={ProductList}/>
			<Route path={`/cart`} component={Cart}/>
			<Route path={`/checkout`} component={Checkout}/>
			<Route path={`/login`} component={Login}/>
			<Route path={`/address`} component={AddressList}/>
			<Route path={`/address-add`} component={AddressForm}/>
		</Switch>
	}
}

Main.propTypes = {
	history: PropTypes.object,
}

export default withRouter(Main)
