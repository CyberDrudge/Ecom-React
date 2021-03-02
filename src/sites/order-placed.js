import React from 'react'

class OrderPlaced extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		const { loading, isCheckoutDone } = this.state
		return (<div>
			<div className="col-6 mx-auto py-5 text-center">
				<h1 className="display-1">Thank you for ordering!!!</h1>
				<h3>Your Order has been successfully placed.</h3>
			</div>
		</div>)
	}
}

export default OrderPlaced