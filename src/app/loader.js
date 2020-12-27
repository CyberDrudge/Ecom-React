import React from 'react'
import Loader from 'react-loader'

class Loading extends React.PureComponent {
	render() {
		const { message, absolute, allowAction } = this.props
		return <div className={absolute ? "absolute-position" : ""}>
			<Loader color="#249182" />
			<span className={allowAction ? '' : "bv-loader-text-container"}>
				<span className="bv-loader-text">{message}</span>
			</span>
		</div>
	}
}

export default Loading
