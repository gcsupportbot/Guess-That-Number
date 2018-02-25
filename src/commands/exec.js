const handleDatabaseError = require('../util/handleDatabaseError.js');
const child_process = require('child_process');
const snekfetch = require('snekfetch');
const formatArbitrary = require('../util/formatArbitrary.js');

module.exports = {
	command: 'exec',
	aliases: [],
	category: 'Developers',
	description: 'Execute commands in the console.',
	usage: 'exec <command>',
	execute: (bot, r, msg, args) => {
		r.table('developers').get(msg.author.id).run((error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign: │ You do not have permission to execute this command.');
			if (args.length > 0) {
				child_process.exec(args.join(' '), (error, stdout) => {
					let result = formatArbitrary((error || stdout).toString());
					if (result.length > 1985) {
						snekfetch.post('https://h.mayo.pw/documents').send(result).then((body) => {
							msg.channel.createMessage(':outbox_tray: │ Result was over 2,000 characters, generated hastebin link instead. https://h.mayo.pw/' + body.body.key + '.js');
						}).catch((error) => {
							msg.channel.createMessage(':exclamation: │ Failed to generate hastebin link. `' + error.message + '`');
						});
					} else {
						msg.channel.createMessage('```\n' + result.replace(/`/g, '\'') + '```');
					}
				});
			} else {
				msg.channel.createMessage(':question: │ Missing `<command>` option.');
			}
		});
	}
};