const config = require('../config.json');
const handleDatabaseError = require('../util/handleDatabaseError.js');

module.exports = {
	commands: [
		'help'
	],
	description: 'Sends the help list to the user via Direct Message.',
	usage: 'help [command]',
	category: 'Information',
	hidden: false,
	execute: (bot, r, msg, args) => {
		r.table('developers').get(msg.author.id).run((error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			const commands = developer ? Object.keys(bot.commands) : Object.keys(bot.commands).filter((c) => !bot.commands[c].hidden);
			let fields = [];
			commands.forEach((c) => {
				const filter = fields.filter((f) => f.name.split(' ')[0] === bot.commands[c].category);
				if (filter.length > 0) {
					fields[fields.indexOf(filter[0])].value += ', `' + bot.commands[c].commands[0] + '`';
				} else {
					fields[fields.length] = {
						name: bot.commands[c].category + ' ─ ' + commands.filter((c2) => bot.commands[c2].category === bot.commands[c].category).length,
						value: '`' + bot.commands[c].commands[0] + '`',
						inline: false
					};
				}
			});
			fields.sort((a, b) => {
				if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
				if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
				return 0;
			});
			if (args.length > 0) {
				if ([].concat.apply([], commands.map((c) => bot.commands[c].commands)).indexOf(args[0]) > -1) {
					const command = commands.filter((c) => bot.commands[c].commands.indexOf(args[0]) > -1)[0];
					msg.channel.createMessage({
						embed: {
							title: 'Command Information - ' + bot.commands[command].commands[0],
							description: bot.commands[command].description,
							color: 3066993,
							fields: [
								{
									name: 'Usage',
									value: bot.commands[command].usage,
									inline: false
								},
								{
									name: 'Category',
									value: bot.commands[command].category,
									inline: false
								}
							]
						}
					});
				} else {
					msg.channel.createMessage({
						embed: {
							title: 'Error!',
							color: 0xE50000,
							description: '`' + args.join(' ') + '` is not a command that I know of.'
						}
					});
				}
			} else {
				msg.channel.createMessage({
					embed: {
						title: 'Command List',
						description: 'To view specific information about a command, run `' + ((msg.channel.guild) ? bot.prefixes[msg.channel.guild.id] : config.prefix) + 'help <command>`.',
						color: 3066993,
						fields,
						footer: {
							text: 'There are ' + commands.length + ' commands in total.'
						}
					}
				});
			}
		});
	}
};
