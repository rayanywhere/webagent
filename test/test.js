const assert = require('assert');
const Crawler = require('../index.js');

describe('#get', function() {
	it('should return status = 200', async function() {
		let request = new Crawler.Request.Get('http://www.baidu.com');
		let crawler = new Crawler();
		let response = await crawler.go(request);
		assert(response.status === 200);
	});
});

describe('#post', function() {
	it('should return status = 200', async function() {
		let request = new Crawler.Request.Post('http://www.baidu.com');
		request.setFormBody({hey:'yo'});
		let crawler = new Crawler();
		let response = await crawler.go(request);
		assert(response.status === 200);

		let crawler2 = new Crawler({
			context: crawler.context
		});
		await crawler2.go(request);
	})
});