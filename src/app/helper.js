
export const trimString = (str, len) => {
	let length = len || 40
	return (str && (str.length > length)) ? `${str.substring(0, length - 3)}...` : str
}
