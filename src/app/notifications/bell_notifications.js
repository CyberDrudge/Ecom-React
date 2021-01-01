import React from 'react'
import { notificationDetails } from './notification_template'
import moment from 'moment'
import PropTypes from 'prop-types'

class BellNotifications extends React.Component {
	constructor(props) {
		super(props)
	}
	boilerplate(notification, subject, message, icon, iconColor) {
		let fromNow = moment(notification.updated_at).fromNow(true)
		return <div>
			<span className="bv-notification-date">{fromNow}</span>
			<span className="bv-notification-title">
				<i className={`${icon} ${iconColor}`}></i>
				<p className="bv-notification-name font14" style={{maxWidth:"70%"}}>{subject}</p>
			</span>
			<p className="bv-notification-desc font12">{message}</p>
		</div>
	}
	render() {
		const { notification, read } = this.props
		let details = notificationDetails(notification)
		return <li className="bv-menu-item">
			{this.boilerplate(notification, details.subject, details.message, details.icon, details.iconColor)}
		</li>

	}
}

BellNotifications.propTypes = {
	notification: PropTypes.object,
	read: PropTypes.bool
}

export default BellNotifications
