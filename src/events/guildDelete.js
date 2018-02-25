const updateSites = require('../util/updateSites.js');
const updatePresence = require('../util/updatePresence.js');

module.exports = (bot) => {
	bot.on('guildDelete', () => {
		updateSites(bot);
		updatePresence(bot);
	});
};