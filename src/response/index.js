module.exports = class Response {
	constructor(status, body) {
		this._status = status;
		this._body = body;
	}

	get status() { return this._status; }
	get body() { return this._body; }
	get textBody() { return this._body.toString('utf8'); }
	get jsonBody() { return JSON.parse(this._body); }
}