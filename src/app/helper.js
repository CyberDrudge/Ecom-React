
export const trimString = (str, len) => {
	let length = len || 40
	return (str && (str.length > length)) ? `${str.substring(0, length - 3)}...` : str
}

export const stringifyAddress = (address) => {
	let addressString = ""
	if (address.name){
		addressString += address.name
	}
	if (address.nickname){
		addressString += ' (' + address.nickname + ')'
	}
	addressString += ', '
	if (address.address_line1){
		addressString += address.address_line1 + ', '
	}
	if (address.address_line2){
		addressString += address.address_line2 + ', '
	}
	if (address.city){
		addressString += address.city + ', '
	}
	if (address.state){
		addressString += address.state + ', '
	}
	if (address.country){
		addressString += address.country + ', '
	}
	if (address.postal_code){
		addressString += address.postal_code
	}
	return addressString
}
