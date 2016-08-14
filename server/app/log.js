/**
 * Created by tinashematate on 30/07/16.
 */

var winston = require('winston');


var Log = function () {
	this.logger = new winston.Logger({
		transports: [
			new (winston.transports.Console)(),
			new (winston.transports.File)({filename: './server/app/storage/app-logs/game-stats.log'})
		]
	});
};

Log.prototype.log = function (data) {
	this.logger.log('info', data);
};


module.exports = Log;