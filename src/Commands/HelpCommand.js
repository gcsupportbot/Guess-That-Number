const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Help extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'help',
			aliases: [],
			description: 'Gets a list of commands sent to your channel.',
			category: 'Utility',
			usage: 'help',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		this.r.table('developers').get(msg.author.id).run((error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			const commands = this.bot.commands.filter((command) => developer ? true : !command.hidden);
			const categories = {};
			for (let i = 0; i < commands.length; i++) {
				if (!(commands[i].category in categories)) categories[commands[i].category] = [];
				categories[commands[i].category].push(commands[i]);
			}
			if (args.length < 1) return msg.channel.createMessage({
				embed: {
					title: 'Command List',
					color: 3066993,
					description: 'Every command below starts with `' + msg.prefix + '`. If you want to learn how to play, use `' + msg.prefix + 'tutorial`.',
					fields: Object.keys(categories).map((category) => ({
						name: category,
						value: categories[category].map((command) => '`' + command.command + '`').join(',  '),
						inline: false
					}))
				}
			});
			const command = commands.filter((command) => command.command.toLowerCase() === args[0].toLowerCase() || command.aliases.includes(args[0].toLowerCase()))[0];
			if (!command) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any commands by that name.');
			msg.channel.createMessage({
				embed: {
					title: command.command,
					color: 3066993,
					description: command.description + '\n\n' + command.aliases.map((c) => '**' + c.usage + '**\n' + c.description).join('\n\n')
				}
			});
		});
	}
}

module.exports = Help;