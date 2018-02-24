const handleDatabaseError = require('../util/handleDatabaseError.js');

module.exports = {
	commands: [
		'restart',
		'reboot'
	],
	usage: 'restart',
	description: 'Restarts the bot.',
	category: 'Developers',
	hidden: true,
	execute: (bot, r, msg) => {
		r.table('developers').get(msg.author.id).run(async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage({
				embed: {
					title: 'Error!',
					color: 0xE50000,
					description: 'You do not have permission to execute this command.'
				}
			});
			msg.channel.createMessage({
				embed: {
					title: 'Restarting...',
					color: 3066993,
					description: 'Automatically restarting the bot.'
				}
			}).then(() => {
				process.exit();
			});
		});
	}
};