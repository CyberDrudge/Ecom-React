import React from 'react'
import { Switch, Route, BrowserRouter as Router, Redirect, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import AddressList from '../sites/address/address-list'
import AddressForm from '../sites/address/address-form'
import Cart from '../sites/cart'
import Checkout from '../sites/checkout'
import Home from './home'
import Login from './login'
import OrderPlaced from '../sites/order-placed'
import ProductList from '../sites/productlist'
import Register from './register'

class Main extends React.PureComponent {
	render() {
		// const { history } = this.props
		return <Switch>
			<Route exact path="/" component={Home}/>
			<Route path={`/address`} component={AddressList}/>
			<Route path={`/address-add`} component={AddressForm}/>
			<Route path={`/cart`} component={Cart}/>
			<Route path={`/checkout`} component={Checkout}/>
			<Route path={`/login`} component={Login}/>
			<Route path={`/order-placed`} component={OrderPlaced}/>
			<Route path={`/products`} component={ProductList}/>
			<Route path={`/register`} component={Register}/>
		</Switch>
	}
}

Main.propTypes = {
	history: PropTypes.object,
}

export default withRouter(Main)
