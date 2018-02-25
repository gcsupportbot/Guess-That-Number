const handleDatabaseError = require('../util/handleDatabaseError.js');

module.exports = {
	command: 'restart',
	aliases: [
		'reboot'
	],
	category: 'Developers',
	description: 'Restarts the bot.',
	usage: 'restart',
	execute: (bot, r, msg) => {
		r.table('developers').get(msg.author.id).run(async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign: │ You do not have permission to execute this command.');
			msg.channel.createMessage(':arrows_counterclockwise: │ Automatically restarting the bot.').then(process.exit);
		});
	}
};