const config = require('../config.json');

module.exports = (bot) => {
	bot.editStatus('online', {
		name: bot.guilds.size + ' Servers | ' + config.prefix + 'help',
		type: 0
	});
};