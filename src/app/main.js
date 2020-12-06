import React from 'react'
import { Switch, Route, BrowserRouter as Router, Redirect, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Home from './home'
import ProductList from './productlist'
import Login from './login'
import Cart from '../sites/cart'

class Main extends React.PureComponent {
	render() {
		// const { history } = this.props
		return <Switch>
			<Route exact path="/" component={Home}/>
			<Route path={`/products`} component={ProductList}/>
			<Route path={`/cart`} component={Cart}/>
			<Route path={`/login`} component={Login}/>
		</Switch>
	}
}

Main.propTypes = {
	history: PropTypes.object,
}

export default withRouter(Main)
