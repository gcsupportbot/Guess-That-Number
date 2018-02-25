const handleDatabaseError = require('../util/handleDatabaseError.js');
const util = require('util');
const snekfetch = require('snekfetch');
const formatArbitrary = require('../util/formatArbitrary.js');

module.exports = {
	command: 'eval',
	aliases: [],
	category: 'Developers',
	description: 'Evaluate arbatrary code within the bot.',
	usage: 'eval <code>',
	execute: (bot, r, msg, args) => {
		r.table('developers').get(msg.author.id).run(async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign: │ You do not have permission to execute this command.');
			if (args.length < 1) return msg.channel.createMessage(bot.__('commands.eval.missing_option.0'));
			try {
				let result = await eval(args.join(' '));
				if (!(result instanceof String)) result = util.inspect(result, {
					depth: 5,
					maxArrayLength: 2000
				});
				result = formatArbitrary(result);
				if (result.length > 1990) {
					snekfetch.post('https://h.mayo.pw/documents').send(result).then((result) => {
						msg.channel.createMessage('https://h.mayo.pw/' + result.body.key);
					}).catch((error) => {
						msg.channel.createMessage(bot.__('commands.eval.upload_failed', error.message));
					});
				} else {
					msg.channel.createMessage('```js\n' + result + '```');
				}
			} catch(e) {
				msg.channel.createMessage('```js\n' + e + '```');
			}
		});
	}
};