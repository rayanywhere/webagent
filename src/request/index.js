const qs = require('query-string');
const assert = require('assert');

module.exports = class Request {
	static get Get() { return require('./get.js'); }
	static get Post() { return require('./post.js'); }

	constructor(url) {
		this._url = url;
		this._query = null;
		this._timeout = 30;
		this._header = {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4)'
		};
	}

	setQuery(query) {
		assert(typeof query === 'object', 'query should be an object');
		this._query = query;
		return this;
	}

	setTimeout(timeout) {
		assert(Number.isInteger(timeout), 'timeout should be an integer');
		this._timeout = timeout;
		return this;
	}

	setHeader(header) {
		assert(typeof header === 'object', 'header should be an object');
		for (let key in header) {
        	this._header[key] = header[key];
    	}
		
		return this;
	}

	toOptions() {
		return {
			url: this._url + (this._query !== null ? `?${qs.stringify(this._query)}` : ''),
			forever: false,
			timeout: this._timeout * 1000,
			encoding: null,
			rejectUnauthorized: false,
			followAllRedirects: true,
			headers: this._header
		};
	}
}
