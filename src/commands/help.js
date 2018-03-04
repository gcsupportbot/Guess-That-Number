const config = require('../config.json');

module.exports = {
	command: 'help',
	aliases: [],
	category: 'Information',
	description: 'Sends the help list to the user via Direct Message.',
	usage: 'help [command]',
	execute: (bot, r, msg, args) => {
		let fields = [];
		bot.commands.forEach((c) => {
			const filter = fields.filter((f) => f.name.split(' ─ ')[0] === c.category);
			if (filter.length > 0) {
				fields[fields.indexOf(filter[0])].value += ', `' + c.command + '`';
			} else {
				fields[fields.length] = {
					name: c.category + ' ─ ' + bot.commands.filter(cmd => cmd.category === c.category).length,
					value: '`' + c.command + '`',
					inline: false
				};
			}
		});
		fields.sort((a, b) => {
			if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
			return 0;
		});
		if (args.length > 0) {
			let command = bot.commands.filter((c) => c.command.toLowerCase() === args[0].toLowerCase() || c.aliases.map((v) => v.toLowerCase()).indexOf(args[0].toLowerCase()) > -1);
			if (command.length > 0) {
				command = command[0];
				msg.channel.createMessage({
					embed: {
						title: 'Command Information - ' + command.command,
						description: command.description,
						color: 3066993,
						fields: [
							{
								name: 'Usage',
								value: command.usage,
								inline: false
							},
							{
								name: 'Category',
								value: command.category,
								inline: false
							}
						]
					}
				});
			} else {
				msg.channel.createMessage(':question: │ `' + args.join(' ') + '` is not a command that I know of.');
			}
		} else {
			msg.channel.createMessage({
				embed: {
					title: 'Command List',
					description: 'To view specific information about a command, run `' + ((msg.channel.guild) ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + 'help <command>`.',
					color: 3066993,
					fields,
					footer: {
						text: 'There are ' + bot.commands.size + ' commands in total.'
					}
				}
			});
		}
	}
};