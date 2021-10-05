'use strict';

exports = module.exports = function (req, res, cb) {
	res.statusCode = 401;
	res.end('Unauthorized');
	cb();
};
