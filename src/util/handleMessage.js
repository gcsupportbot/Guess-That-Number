const config = require('../config.json');
const guess = require('../commands/guess.js');
const logger = require('./logger.js');

module.exports = (bot, r, msg) => {
	if (!bot.ready || !msg || !msg.author || msg.author.bot) return;
	if (bot.toggle.has(msg.author.id)) {
		if (msg.content !== '' && !isNaN(parseInt(msg.content.replace(/,/g, '')))) {
			let new_event = Object.create(msg);
			new_event.content = config.prefix + 'guess ' + Number(msg.content.replace(/,/g, ''));
			guess.execute(bot, r, new_event, new_event.content.split(' ').slice(1));
			return;
		}
	}
	if (msg.channel.type === 0 && !bot.prefixes.has(msg.channel.guild.id)) bot.prefixes.set(msg.channel.guild.id, config.prefix);
	const prefix = ((msg.channel.guild && msg.content.startsWith(bot.prefixes.get(msg.channel.guild.id))) && bot.prefixes.get(msg.channel.guild.id)) || ((!msg.channel.guild && msg.content.startsWith(config.prefix)) && config.prefix) || (msg.content.startsWith('<@' + bot.user.id + '>') && '<@' + bot.user.id + '>') || (msg.content.startsWith('<@!' + bot.user.id + '>') && '<@!' + bot.user.id + '>');
	if (!prefix) return;
	const commands = bot.commands.filter((c) => c.command.toLowerCase() === msg.content.replace(prefix, '').trim().split(' ')[0].toLowerCase() || c.aliases.includes(msg.content.replace(prefix, '').split(' ')[0]));
	if (commands.length < 1) return;
	try {
		commands[0].execute(bot, r, msg, msg.content.replace(prefix, '').trim().split(' ').slice(1));
	} catch (e) {
		msg.channel.createMessage('An error occured while running that command. If you want immedient assistance, please join our support server: ' + config.links.server);
		console.error(e);
	}
};
