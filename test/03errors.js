'use strict';

const request = require('request');
const async = require('async');
const path = require('path');
const test = require('tape');
const Api = require(__dirname + '/../index.js');
const testEnvPath = path.normalize(__dirname + '/../test_environment');

test('404 for old version', function (t) {
	const tasks = [];

	let api;

	// Start server
	tasks.push(function (cb) {
		api = new Api({
			routerOptions: {basePath: testEnvPath + '/1'}
		});

		cb();
	});

	tasks.push(function (cb) {
		api.start(cb);
	});

	// Try 404 request
	tasks.push(function (cb) {
		request('http://localhost:' + api.base.httpServer.address().port + '/wepp', function (err, response, body) {
			if (err) return cb(err);
			t.equal(response.statusCode, 404);
			t.equal(body, '"URL endpoint not found"');
			cb();
		});
	});

	// Close server
	tasks.push(function (cb) {
		api.stop(cb);
	});

	async.series(tasks, function (err) {
		if (err) throw err;
		t.end();
	});
});

test('404 for non existing url', function (t) {
	const tasks = [];

	let api;

	// Start server
	tasks.push(function (cb) {
		api = new Api({
			routerOptions: {basePath: testEnvPath + '/1'}
		});

		cb();
	});

	tasks.push(function (cb) {
		api.start(cb);
	});

	// Try 404 request
	tasks.push(function (cb) {
		request('http://localhost:' + api.base.httpServer.address().port + '/turbojugend', function (err, response, body) {
			if (err) return cb(err);
			t.equal(response.statusCode, 404);
			t.equal(body, '"URL endpoint not found"');
			cb();
		});
	});

	// Close server
	tasks.push(function (cb) {
		api.stop(cb);
	});

	async.series(tasks, function (err) {
		if (err) throw err;
		t.end();
	});
});

test('500 error when controller is borked', function (t) {
	const tasks = [];

	let api;

	// Start server
	tasks.push(function (cb) {
		api = new Api({
			routerOptions: {basePath: testEnvPath + '/2'}
		});
		cb(); // Running this outside to get better test coverage
	});

	tasks.push(function (cb) {
		api.start(cb);
	});

	// Try broken request
	tasks.push(function (cb) {
		request('http://localhost:' + api.base.httpServer.address().port + '/broken', function (err, response, body) {
			if (err) return cb(err);
			t.equal(response.statusCode, 500);
			t.equal(body, '"Internal server error: this should happend"');
			cb();
		});
	});

	// Close server
	tasks.push(function (cb) {
		api.stop(cb);
	});

	async.series(tasks, function (err) {
		if (err) throw err;
		t.end();
	});
});

/* Does not work with root-accounts
test('500 error if something is wrong with the README file', function (t) {
	const tasks = [];

	// Fuck up the permissions of the README file
	fs.chmodSync(testEnvPath + '/4/lurk/README.md', '000');

	const api = new Api({ routerOptions: { basePath: testEnvPath + '/4' } });

	// Start server
	tasks.push(cb => {
		api.start(cb);
	});

	// Try broken request
	tasks.push(function (cb) {
		request('http://localhost:' + api.base.httpServer.address().port + '/lurk', function (err, response, body) {
			if (err) return cb(err);

			console.log(body);

			t.equal(response.statusCode, 500, 'Should give access denied internally, which gives 500.');
			t.equal(body.substring(0, 49), '"Internal server error: EACCES: permission denied');
			cb();
		});
	});

	// Close server
	tasks.push(function (cb) {
		api.stop(cb);
	});

	// Change back ok permissions to the README file
	tasks.push(function (cb) {
		fs.chmodSync(testEnvPath + '/4/lurk/README.md', '644');
		cb();
	});

	async.series(tasks, function (err) {
		if (err) throw err;
		t.end();
	});
});
*/

test('500 error when controller data is circular', function (t) {
	const tasks = [];
	const api = new Api({
		routerOptions: {basePath: testEnvPath + '/2'}
	});

	// Start server
	tasks.push(function (cb) {
		api.start(cb);
	});

	// Try broken request
	tasks.push(function (cb) {
		request('http://localhost:' + api.base.httpServer.address().port + '/circular', function (err, response, body) {
			if (err) return cb(err);
			t.equal(response.statusCode, 500);
			t.equal(body.startsWith('"Internal server error: Converting circular structure to JSON'), true);
			cb();
		});
	});

	// Close server
	tasks.push(function (cb) {
		api.stop(cb);
	});

	async.series(tasks, function (err) {
		if (err) throw err;
		t.end();
	});
});

test('Response sent in the controller and error callback should work', function (t) {
	const tasks = [];
	const api = new Api({
		routerOptions: {basePath: testEnvPath + '/2'}
	});

	// Start server
	tasks.push(function (cb) {
		api.start(cb);
	});

	// Try broken request
	tasks.push(function (cb) {
		request('http://localhost:' + api.base.httpServer.address().port + '/responseSentAndError', function (err, response, body) {
			if (err) return cb(err);
			t.equal(response.statusCode, 404);
			t.equal(body, 'Not found!');
			cb();
		});
	});

	// Close server
	tasks.push(function (cb) {
		api.stop(cb);
	});

	async.series(tasks, function (err) {
		if (err) throw err;
		t.end();
	});
});

test('Response sent in the controller should work', function (t) {
	const tasks = [];
	const api = new Api({
		routerOptions: {basePath: testEnvPath + '/2'}
	});

	// Start server
	tasks.push(function (cb) {
		api.start(cb);
	});

	// Try broken request
	tasks.push(function (cb) {
		request('http://localhost:' + api.base.httpServer.address().port + '/responseSent', function (err, response, body) {
			if (err) return cb(err);
			t.equal(response.statusCode, 401);
			t.equal(body, 'Unauthorized');
			cb();
		});
	});

	// Close server
	tasks.push(function (cb) {
		api.stop(cb);
	});

	async.series(tasks, function (err) {
		if (err) throw err;
		t.end();
	});
});
