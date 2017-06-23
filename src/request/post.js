const Request = require('./index.js');
const Ajv = require('ajv');
const ajv = new Ajv();
const qs = require('query-string');

module.exports = class RequestPost extends Request {
	constructor(url) {
		super(url);
		this._bodyType = null;
		this._bodyData = null;
		this._contentType = null;
	}

	setRawBody(body, contentType = 'application/x-www-form-urlencoded') {
		if (!ajv.validate({
			type: "string"
		}, body)) {
			throw new Error('bad body, reason:' + ajv.errorsText());
		}
		this._bodyType = 'raw';
		this._bodyData = body;
		this._contentType = contentType;
		return this;
	}

	setFormBody(body) {
		if (!ajv.validate({
			type: "object",
			patternProperties:  {
				"^.+$": { type: ["integer", "number", "boolean", "string", "array", "object", "null"] }
			}
		}, body)) {
			throw new Error('bad body, reason:' + ajv.errorsText());
		}
		this._bodyType = 'form';
		this._bodyData = body;
		this._contentType = 'application/x-www-form-urlencoded';
		return this;
	}

	setJsonBody(body) {
		if (!ajv.validate({
			type: "object",
			patternProperties:  {
				"^.+$": { type: ["integer", "number", "boolean", "string", "array", "object", "null"] }
			}
		}, body)) {
			throw new Error('bad body, reason:' + ajv.errorsText());
		}
		this._bodyType = 'json';
		this._bodyData = body;
		this._contentType = 'application/json';
		return this;
	}

	toOptions() {
		let opts = super.toOptions();
		opts.method = 'POST';
		opts.headers['Content-Type'] = this._contentType;
		switch(this._bodyType) {
			case 'form':
				opts.body = qs.stringify(this._bodyData);
				break;
			case 'json':
				opts.body = JSON.stringify(this._bodyData);
				break;
			case 'raw':
				opts.body = this._bodyData;
				break;
			default:
				throw new Error('body is not set');
				break;
		}
		return opts;
	}
}
