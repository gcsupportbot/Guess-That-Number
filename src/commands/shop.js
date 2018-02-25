const config = require('../config.json');

module.exports = {
	command: 'shop',
	aliases: [
		'store',
		'buy'
	],
	category: 'Game',
	description: 'Buy an item from the shop using the money that you get from games.',
	usage: 'shop [item name] [amount]',
	execute: (bot, r, msg) => {
		msg.channel.createMessage(':thinking: │ The developer of this bot currently is unable to think of anything to add to this shop. If you have an idea of what to put here, please suggest it here: ' + config.links.server);
	}
};