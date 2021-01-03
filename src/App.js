import React from 'react'
import { Route, HashRouter as Router, Redirect, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import './App.css'
import Main from './app/main'
import Header from './app/header'
import * as actionCreators from './app/actioncreators'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: false, notifications:[]}
		this.refresh = this.refresh.bind(this)
		this.loadNotifications = this.loadNotifications.bind(this)
	}

	componentDidMount(){
		const { actions } = this.props
		actions.autoLogin()
		// this.loadNotifications()
	}

	loadNotifications() {
		const { actions } = this.props
		this.setState({loading: true})
		actions.fetchNotifications()
			.then((res) => {
				let data = res.data.data
				this.setState({loading: false, notifications: res.data.data})
				// actions.setNotifications(res.data)
				// actions.updateDashboardLoad(true)
				// this.refreshInstance = setInterval(this.refresh, 20000)
			})
			.catch((res) => {
				this.setState({ loadError: true })
			})
	}
	refresh() {
		const { refreshed } = this.state
		const { actions } = this.props
		actions.fetchNotifications()
			.then((res) => {
				actions.setNotifications(res.data)
			})
			.catch((res) => {
				console.log('Connection Lost')
			})
	}
	render() {
		const { loading, notifications } = this.state
		if (loading) {
			return <div>Loading </div>
		} else {
			return (
				<div className="App">
					<Header notifications={notifications} />
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
