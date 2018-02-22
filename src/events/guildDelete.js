const updateBotLists = require('../util/updateSites.js');
const updatePresence = require('../util/updatePresence.js');

module.exports = (bot) => {
	bot.on('guildDelete', (server) => {
		updateBotLists(bot);
		updatePresence(bot);
	});
};
