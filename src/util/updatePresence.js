const config = require('../config.json');

module.exports = (bot) => {
	bot.editStatus('online', {
		name: bot.guilds.size + ' servers | ' + config.prefix + 'help',
		type: 3
	});
};