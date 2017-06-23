const assert = require('assert');
const Request = require('./src/request');
const Response = require('./src/response');
const Core = require('request');

module.exports = class Crawler {
	static get Request() { return Request; }
	static get Response() { return Response; }

	/*
	 * options = {proxy, context:{cookies, url}, debug}
	 */
	constructor(options = {}) {
		//step 1. validate options
		assert(options.proxy === undefined || typeof options.proxy === 'string', 'options.proxy should be a string or undefined');
		assert(options.context === undefined || typeof options.context === 'object' && typeof options.context.cookies === 'object' && typeof options.context.url === 'string', 'options.context should a object that contains both cookies and url or undefined');
		assert(options.debug === undefined || typeof options.debug === 'boolean', 'options.debug should be a boolean or undefined');

		//step 2. create core(request object)
		this._core = Core.defaults(options.proxy ? {proxy: options.proxy, tunnel: false} : {});

		//step 3. setup context according to options
		this._context = {
			url: options.context ? options.context.url : null,
			jar: Core.jar()
		};
		if (options.context) {
			for (let name in options.context.cookies) {
				let value = options.context.cookies[name];
				this._context.jar.setCookie(`${name}=${value}`, options.context.url);
			}
		}

		//step 4. switch debug on if demanded
		if (options.debug) {
			Core.debug = true;
		}
	}

	get context() {
		if (this._context.url === null) {
			return {
				cookies: {},
				url: null
			};
		}

		let pairs = {};
		this._context.jar.getCookies(this._context.url).forEach((item) => {
			pairs[item.key] = item.value;
		});

		return {
			cookies: pairs,
			url: this._context.url
		};
	}

	go(req) {
		this._lastRequest = req;

		let opts = req.toOptions();
		opts.jar = this._context.jar;
		if (this._context.url !== null) {
			opts.headers.Referer = this._context.url;
		}

		return new Promise((resolve, reject) => {
			this._core(opts, (err, resp, body) => {
				if (err) {
					reject(err);
					return;
				}

				this._context.url = resp.request.uri.href;

				let response = new Response(resp.statusCode, body);
				this._lastResponse = response;
				resolve(response);
			});
		});
	}

	ajax(req) {
		this._lastRequest = req;

		let opts = req.toOptions();
		opts.jar = this._context.jar;
		opts.headers['X-Requested-With'] = 'XMLHttpRequest';
		if (this._context.url !== null) {
			opts.headers.Referer = this._context.url;
		}

		return new Promise((resolve, reject) => {
			this._core(opts, (err, resp, body) => {
				if (err) {
					reject(err);
					return;
				}

				let response = new Response(resp.statusCode, body);
				this._lastResponse = response;
				resolve(response);
			});
		});
	}
}
