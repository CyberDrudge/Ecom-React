export function notificationDetails(notification) {
	let message, subject, icon, link, iconColor
	if (notification.category) {
		switch (notification.category) {
			case 1: {
				message = `Your Site is password protected. Please provide correct details to access the site.`
				subject = "Authentication Required"
				icon = "mdi mdi-lock-question"
				iconColor = "orange-color"
				link = ""
				break
			}
			case 2: {
				message = `First Scan Completed. Your Site has malware content.`
				subject = `First Scan Completed`
				icon = "mdi mdi-sync-alert"
				iconColor = "red-color"
				break
			}
		}
	}
	return {
		message:message,
		subject:subject,
		icon:icon,
		iconColor: iconColor,
		link:link
	}
}


