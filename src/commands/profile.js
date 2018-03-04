const handleDatabaseError = require('../util/handleDatabaseError.js');
const config = require('../config.json');

module.exports = {
	command: 'profile',
	aliases: [],
	category: 'General',
	description: 'View the profile of yourself or another user.',
	usage: 'profile [@user | userID | username]',
	execute: (bot, r, msg) => {
		r.table('user_statistics').get(msg.author.id).run((error, user) => {
			if (error) return handleDatabaseError(error, msg);
			msg.channel.createMessage({
				embed: {
					title: 'Your Profile',
					color: 3066993,
					thumbnail: {
						url: msg.author.avatarURL
					},
					description: 'You can purchase things to display on your profile within the `' + ((msg.channel.guild) ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + 'shop`.',
					fields: [
						{
							name: 'Coins',
							value: user ? user.coins : 0,
							inline: true
						},
						{
							name: 'Total Coins',
							value: user ? user.totalCoins : 0,
							inline: true
						},
						{
							name: 'More things...',
							value: 'coming soon! :eyes:',
							inline: true
						}
					]
				}
			});
		});
	}
};