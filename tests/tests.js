exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	chromeOnly: true,
	specs: [
		'e2e/TC01-loadData.js',
		'backend/TC01-getNotFound.js'
	]

};
