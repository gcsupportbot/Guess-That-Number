const config = require('../config.json');

module.exports = (data) => {
	return data
		.split(config.token).join('-- BOT TOKEN --')
		.split(config.api_keys.bot_list['discordbots.org']).join('-- discordbots.org API KEY --')
		.split(config.api_keys.bot_list['ls.terminal.ink']).join('-- ls.terminal.ink API KEY --')
		.split(config.api_keys.bot_list.carbonitex).join('-- CARBONITEX API KEY --')
		.split(config.rethink.host).join('-- RETHINKDB HOST IP ADDRESS --');
};