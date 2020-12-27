import React from 'react'
import { Alert } from 'react-bootstrap'
import AutoAffix from "react-overlays/lib/AutoAffix";
import PropTypes from 'prop-types'

class Error extends React.Component {
	constructor(props) {
		super(props)
		this.state = {visible: true}
		this.handleAlertDismiss = this.handleAlertDismiss.bind(this)
		this.handleAlertShow = this.handleAlertShow.bind(this)
	}
	componentDidUpdate(prevProps, prevState) {
		// to handle form submissions where the user hides the alert but the component is not unmounted
		// for subsequence submissions, we want to show latest alerts
		// IDEALLY the parent should unmount the alert using onDismiss callback
		if (!prevState.visible) {
			this.handleAlertShow()
		}
	}
	handleAlertDismiss() {
		const { onDismiss } = this.props
		this.setState({	visible: false })
		onDismiss && onDismiss()
	}
	handleAlertShow() {
		this.setState({	visible: true })
	}
	render() {
		const { visible } = this.state
		if (visible) {
			const { message } = this.props
			return <div className="bv-affix-wrapper">
				<AutoAffix container={ window.bvmain } affixClassName="sticky-header">
					<Alert bsStyle="danger" bsClass="bv-custom-notification bv-notification-error" onDismiss={ this.handleAlertDismiss }>
						<p style={{ paddingTop: "7px" }}>{ message || "Something went wrong! Please refresh this page or contact us." }</p>
					</Alert>
				</AutoAffix>
			</div>
		}
		return null
	}
}

Error.propTypes = {
	message: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node
	]),
	onDismiss: PropTypes.func
}

export default Error
