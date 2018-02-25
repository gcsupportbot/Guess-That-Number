const config = require('../config.json');

module.exports = {
	command: 'donate',
	aliases: [
		'patreon'
	],
	category: 'General',
	description: 'Get the donation links to support the creator.',
	usage: 'donate',
	execute: (bot, r, msg) => {
		msg.channel.createMessage(':money_with_wings: │ Woah, there! Thank you for considering to donate to me. Any amount is greatly appreciated, and will support me with future projects and keep my current projects alive. You can either donate via PayPal (<' + config.links.paypal + '>) or you can donate via Patreon (<' + config.links.patreon + '>).');
	}
};