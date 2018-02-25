const config = require('../config.json');

module.exports = {
	command: 'invite',
	aliases: [
		'inv'
	],
	category: 'General',
	description: 'Invite this bot to your server.',
	usage: 'invite',
	execute: (bot, r, msg) => {
		msg.channel.createMessage(':inbox_tray: │ Enjoying the bot? If so, you are probably wanting to put it in your own server. To get it in your server, simply click this link: <' + config.links.bot + '>.');
	}
};