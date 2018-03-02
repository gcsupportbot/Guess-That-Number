const config = require('../config.json');

module.exports = {
	command: 'github',
	aliases: [],
	category: 'General',
	description: 'Gets the GitHub link for the bot.',
	usage: 'github',
	execute: (bot, r, msg) => {
		msg.channel.createMessage(':eight_spoked_asterisk: │ Here\'s the link for the GitHub repository: <' + config.links.github + '>.');
	}
};
