const config = require('../config.json');
const updateBotLists = require('../util/update-sites.js');
const updatePresence = require('../util/updatePresence.js');
const log = require('../util/log.js');
const dateformat = require('dateformat');

module.exports = (bot) => {
	bot.on('guildCreate', (server) => {
		bot.prefixes[server.id] = config.prefix;
		if (bot.users.get(server.ownerID)) bot.users.get(server.ownerID).getDMChannel().then((dm) => dm.createMessage('Hello, there! Either you or one of your admins added me to your server, but you are the most relavent person I can send this to.\n\nTo use the bot, use `' + config.prefix + 'help` to view a list of commands. You can additionally use `' + config.prefix + 'howtoplay` to get a tutorial on how to play this bot.\n\nSorry to ask this of you, but right now, I am currently not getting enough funding to support hosting costs. If you are a true supporter, then please consider donating at <https://patreon.com/passthemayo>.\n\nThank you!'));
		updateBotLists(bot);
		updatePresence(bot);
		log(bot, {
			embed: {
				title: 'Joined a server',
				color: 3066993,
				thumbnail: {
					url: server.icon ? 'https://cdn.discordapp.com/icons/' + server.id + '/' + server.icon + '.png?size=512' : null
				},
				description: '**Name**: ' + server.name + '\n**ID**: ' + server.id + '\n**Members**: ' + server.memberCount + '\n**Owner**: ' + server.members.get(server.ownerID).username + '#' + server.members.get(server.ownerID).discriminator + ' (' + server.ownerID + ')',
				footer: {
					text: dateformat(Date.now(), 'mm/dd/yyyy hh:MM:ss TT')
				}
			}
		});
	});
};