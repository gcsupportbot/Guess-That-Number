const handleDatabaseError = require('../util/handleDatabaseError.js');
const snekfetch = require('snekfetch');
const util = require('util');
const removeSensitiveInformation = require('../util/formatArbitrary.js');

module.exports = {
	commands: [
		'eval'
	],
	usage: 'eval <code>',
	description: 'Evalute code inside the bot.',
	category: 'Developers',
	hidden: true,
	execute: async (bot, r, msg, args) => {
		r.table('developers').get(msg.author.id).run(async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage({
				embed: {
					title: 'Error!',
					color: 0xE50000,
					description: 'You do not have permission to execute this command.'
				}
			});
			if (args.length > 0) {
				try {
					let result = await eval(args.join(' '));
					if (typeof (result) !== 'string') result = util.inspect(result, {
						depth: 3,
						maxArrayLength: 2048
					});
					result = removeSensitiveInformation(result);
					if (result.length > 1985) {
						snekfetch.post('https://h.mayo.pw/documents').send(result).then((body) => {
							msg.channel.createMessage({
								embed: {
									title: 'Warning!',
									color: 0xFFA500,
									description: 'Result was over 2,000 characters, Generated hastebin link instead. https://h.mayo.pw/' + body.body.key + '.js'
								}
							});
						}).catch((error) => {
							msg.channel.createMessage({
								embed: {
									title: 'Error!',
									color: 0xE50000,
									description: 'Failed to generate hastebin link. `' + error.message + '`'
								}
							});
						});
					} else {
						msg.channel.createMessage('```js\n' + result + '```');
					}
				} catch (e) {
					msg.channel.createMessage('```js\n' + e + '```');
				}
			} else {
				msg.channel.createMessage({
					embed: {
						title: 'Error!',
						color: 0xE50000,
						description: 'Missing `<code>` option.'
					}
				});
			}
		})
	}
};