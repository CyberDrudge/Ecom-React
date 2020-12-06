import React from 'react'
import { Route, BrowserRouter as Router, Redirect, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import './App.css'
import Main from './app/main'
import Header from './app/header'
import * as actionCreators from './app/actioncreators'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: false}
	}
	componentDidMount(){
		const { actions } = this.props
		actions.autoLogin()
	}
	render() {
		const { loading } = this.state
		if (loading) {
			return <div>Loading </div>
		} else {
			return (
				<div className="App">
					<Header />
					<Main />
				</div>
			)
		}
	}
}

const AppWithRouter = withRouter(App)

const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

export default connect(null, mapDispatchToProps)(AppWithRouter)
