const config = require('../config.json');

module.exports = {
	command: 'server',
	aliases: [
		'support',
		'feedback'
	],
	category: 'General',
	description: 'Join the official support server.',
	usage: 'server',
	execute: (bot, r, msg) => {
		msg.channel.createMessage(':tada: │ Come hang out with us in the official support server, or just suggest something for the bot. ' + config.links.server);
	}
};