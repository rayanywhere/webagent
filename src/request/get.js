const Request = require('./index.js');
const qs = require('query-string');

module.exports = class RequestGet extends Request {
	toOptions() {
		let opts = super.toOptions();
		opts.method = 'GET';
		return opts;
	}
}
