const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Shop extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'shop',
			aliases: [
				'store',
				'buy'
			],
			description: 'Buy an item from the shop using the money that you get from games.',
			category: 'Game',
			usage: 'shop',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		msg.channel.createMessage(':thinking:   **»**   The developer of this bot currently is unable to think of anything to add to this shop. If you have an idea of what to put here, please suggest it here: ' + config.links.server);
	}
}

module.exports = Shop;