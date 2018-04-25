const BaseCommand = require('../Structure/BaseCommand');

class Game extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'game',
			aliases: [],
			description: 'Just a placeholder to help newbies learn the help list a little better.',
			category: 'Placeholder',
			usage: 'game',
			hidden: true
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		msg.channel.createMessage('No, that\'s not what I meant by the help list. Each command is listed **below** the category seperated by commas, not the category name. For example, a command in this category would be `' + msg.prefix + 'start`.');
	}
}

module.exports = Game;