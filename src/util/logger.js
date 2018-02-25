/* eslint no-console: off */

const dateformat = require('dateformat');
const chalk = require('chalk');
const util = require('util');

module.exports.info = (message) => {
	console.log(chalk.blue(dateformat(Date.now(), 'mm/dd/yyyy hh:MM:ss TT')) + ' - ' + chalk.green('[INFO]') + ' ' + message);
};

module.exports.warn = (message) => {
	console.log(chalk.blue(dateformat(Date.now(), 'mm/dd/yyyy hh:MM:ss TT')) + ' - ' + chalk.yellow('[WARN]') + ' ' + message);
};

module.exports.error = (message) => {
	if (!(message instanceof String)) message = util.inspect(message);
	console.log(chalk.blue(dateformat(Date.now(), 'mm/dd/yyyy hh:MM:ss TT')) + ' - ' + chalk.red('[ERROR]') + ' ' + message);
};