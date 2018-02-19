const config = require('../config.json');

module.exports = {
	commands: [
		'shop',
		'store',
		'buy'
	],
	usage: 'shop [item name] [amount]',
	description: 'Buy an item from the shop using the money that you get from games.',
	category: 'Game',
	hidden: false,
	execute: (bot, r, msg) => {
		msg.channel.createMessage({
			embed: {
				title: 'Shop',
				color: 3066993,
				description: 'The developer of this bot currently is unable to think of anything to add to this shop. If you have an idea of what to put here, please suggest it here: ' + config.links.contact
			}
		});
	}
};