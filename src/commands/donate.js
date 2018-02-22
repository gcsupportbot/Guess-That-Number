const config = require('../config.json');

module.exports = {
	commands: [
		'donate',
		'patreon'
	],
	usage: 'donate',
	description: 'Get the donation links to support the creator and receive perks.',
	category: 'General',
	hidden: false,
	execute: (bot, r, msg) => {
		msg.channel.createMessage({
			embed: {
				title: 'Donation Links',
				color: 3066993,
				description: 'Donating can help you recieve some insane perks in this bot. Check it out on our Patreon page.',
				fields: [
					{
						name: 'Patreon',
						value: config.links.patreon,
						inline: true
					}
				]
			}
		});
	}
};