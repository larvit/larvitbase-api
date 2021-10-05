'use strict';

exports = module.exports = function (req, res, cb) {
	res.statusCode = 404;
	res.end('Not found!');
	cb(new Error('Page not found'));
};
