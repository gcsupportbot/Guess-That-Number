const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Balance extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'invite',
			aliases: [
				'inv'
			],
			description: 'Get the invite to get Guess That Number added to your server.',
			category: 'Utility',
			usage: 'invite',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		msg.channel.createMessage(':inbox_tray:   **»**   You can invite ' + this.bot.user.username + ' using the following link: <' + config.links.invite + '>.');
	}
}

module.exports = Balance;