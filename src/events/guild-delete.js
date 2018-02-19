const updateBotLists = require('../util/update-sites.js');
const updatePresence = require('../util/updatePresence.js');
const log = require('../util/log.js');
const dateformat = require('dateformat');

module.exports = (bot) => {
	bot.on('guildDelete', (server) => {
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