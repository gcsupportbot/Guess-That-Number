const Logger = require('../Util/Logger.js');
const handleDatabaseError = require('../Util/handleDatabaseError');
const config = require('../config.json');

module.exports = (bot, r) => {
	bot.on('messageCreate', (msg) => {
		if (!bot.ready || !msg.author || msg.author.bot) return;
		let prefix = msg.channel.guild && bot.prefixes.has(msg.channel.guild.id) ? bot.prefixes.get(msg.channel.guild.id) : config.default_prefix;
		if (bot.toggle.has(msg.author.id) && msg.content !== '' && !isNaN(parseInt(msg.content.replace(/,/g, '')))) {
			msg.content = prefix + 'guess ' + Number(msg.content.replace(/,/g, ''));
		}
		if (!msg.content.startsWith(prefix)) return;
		msg.prefix = prefix;
		const command = msg.content.split(' ')[0].replace(prefix, '').toLowerCase();
		const commands = bot.commands.filter((c) => c.command === command || c.aliases.includes(command));
		const args = msg.content.replace(/ {2,}/g, ' ').replace(prefix, '').split(' ').slice(1);
		if (commands.length > 0) {
			r.table('commands').insert({
				timestamp: Date.now(),
				userID: msg.author.id,
				channelID: msg.channel.guild ? msg.channel.id : null,
				guildID: msg.channel.guild ? msg.channel.guild.id : null,
				command: commands[0].command,
				args,
				successful: false
			}).run((error, result) => {
				if (error) return handleDatabaseError(error, msg);
				try {
					commands[0].execute(msg, args);
					r.table('commands').get(result.generated_keys[0]).update({
						successful: true
					}).run((error) => {
						if (error) handleDatabaseError(error);
					});
				} catch (e) {
					msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
					Logger.error('Failed to run command.', e);
				}
			});
		}
	});
};