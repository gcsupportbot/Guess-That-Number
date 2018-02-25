const updateSites = require('../util/updateSites.js');
const config = require('../config.json');
const updatePresence = require('../util/updatePresence.js');

module.exports = (bot) => {
	bot.on('guildCreate', (server) => {
		bot.prefixes.set(server.id, config.prefix);
		updateSites(bot);
		updatePresence(bot);
	});
};