const config = require('../config.json');

module.exports = (bot) => {
	bot.editStatus('online', {
		name: 'for ' + config.prefix + 'help',
		type: 3
	});
};