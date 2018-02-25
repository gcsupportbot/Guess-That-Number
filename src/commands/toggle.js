const handleDatabaseError = require('../util/handleDatabaseError.js');
const config = require('../config.json');

module.exports = {
	command: 'toggle',
	aliases: [
		'tog'
	],
	category: 'Game',
	description: 'Send guess as single message.',
	usage: 'toggle',
	execute: (bot, r, msg) => {
		r.table('games').get(msg.author.id).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (response) {
				r.table('toggle').get(msg.author.id).run((error, response) => {
					if (error) return handleDatabaseError(error, msg);
					if (response) {
						r.table('toggle').get(msg.author.id).delete().run((error) => {
							if (error) return handleDatabaseError(error, msg);
							bot.toggle.delete(msg.author.id);
							msg.channel.createMessage({
								embed: {
									title: 'Toggled!',
									color: 3066993,
									description: 'Turned off toggle mode.'
								}
							});
						});
					} else {
						r.table('toggle').insert({ id: msg.author.id }).run((error) => {
							if (error) return handleDatabaseError(error, msg);
							bot.toggle.set(msg.author.id, true);
							msg.channel.createMessage({
								embed: {
									title: 'Toggled!',
									color: 3066993,
									description: 'All your messages that are numbers will be counted as a guess from now on.'
								}
							});
						});
					}
				});
			} else {
				msg.channel.createMessage({
					embed: {
						title: 'Error!',
						color: 0xE50000,
						description: 'You must be in a game to use this command. Start a game using `' + ((msg.channel.guild) ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + 'start`.'
					}
				});
			}
		});
	}
};