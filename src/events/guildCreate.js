const config = require('../config.json');
const updateBotLists = require('../util/updateSites.js');
const updatePresence = require('../util/updatePresence.js');

module.exports = (bot) => {
	bot.on('guildCreate', (server) => {
		bot.prefixes[server.id] = config.prefix;
		if (bot.users.get(server.ownerID)) bot.users.get(server.ownerID).getDMChannel().then((dm) => dm.createMessage('Hello, there! Either you or one of your admins added me to your server, but you are the most relavent person I can send this to.\n\nTo use the bot, use `' + config.prefix + 'help` to view a list of commands. You can additionally use `' + config.prefix + 'howtoplay` to get a tutorial on how to play this bot.\n\nSorry to ask this of you, but right now, I am currently not getting enough funding to support hosting costs. If you are a true supporter, then please consider donating at <https://patreon.com/passthemayo>.\n\nThank you!'));
		updateBotLists(bot);
		updatePresence(bot);
	});
};