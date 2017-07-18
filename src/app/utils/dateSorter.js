module.exports = {
	sortByDate: (key) => (a, b) => {
		return new Date(b[key]) - new Date(a[key]);
	}
}