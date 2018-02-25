const path = require('path');
const handleDatabaseError = require('../util/handleDatabaseError.js');
const fs = require('fs');
const util = require('util');

module.exports = {
	command: 'reload',
	aliases: [],
	category: 'Developers',
	description: 'Reloads a command from the filesystem.',
	usage: 'reload <command | file>',
	execute: (bot, r, msg, args) => {
		r.table('developers').get(msg.author.id).run((error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign: │ You do not have permission to execute this command.');
			if (args.length > 0) {
				if (args[0] === 'all') {
					fs.readdir('./commands/', (error, files) => {
						if (error) return msg.channel.createMessage(':exclamation: │ An unexpected error occured while reading commands directory.');
						files.forEach((c) => {
							delete require.cache[path.normalize(__dirname + '/' + c)];
							try {
								bot.commands.set(c.replace(/\..*/g, ''), require(path.normalize('./commands/' + c)));
								if (files.indexOf(c) === files.length - 1) {
									msg.channel.createMessage(':arrows_counterclockwise: │ Successfully reloaded all commands.');
								}
							} catch (e) {
								msg.channel.createMessage(':exclamation: │ An error occured while trying to reload command.\n```js\n' + util.inspect(e) + '```');
							}
						});
					});
				} else {
					var check = bot.commands.filter((c) => c.command.toLowerCase() === args[0].toLowerCase() || c.aliases.map((v) => v.toLowerCase()).indexOf(args[0].toLowerCase()) > -1);
					if (check.length > 0) {
						delete require.cache[path.normalize(__dirname + '/' + check[0] + '.js')];
						try {
							bot.commands.set(check[0], require('./' + check[0] + '.js'));
							msg.channel.createMessage(':arrows_counterclockwise: │ Command `' + bot.commands.get(check[0]).command + '` has been reloaded.');
						} catch (e) {
							msg.channel.createMessage(':exclamation: │ An error occured while trying to reload command.\n```js\n' + util.inspect(e) + '```');
						}
					} else {
						fs.readdir('./commands/', (error, files) => {
							if (error) return msg.channel.createMessage(':exclamation: │ An unexpected error occured while reading commands directory.');
							if (files.indexOf(args[0] + '.js') < 0) return msg.channel.createMessage(':question: │ Unknown command, `' + args[0] + '`.');
							delete require.cache[path.normalize(__dirname + '/' + args[0] + '.js')];
							try {
								bot.commands.set(args[0], require('./commands/' + args[0] + '.js'));
								msg.channel.createMessage(':arrows_counterclockwise: │ Command `' + bot.commands.get(args[0]).command + '` has been reloaded.');
							} catch (e) {
								msg.channel.createMessage(':exclamation: │ An error occured while trying to reload command.\n```js\n' + util.inspect(e) + '```');
							}
						});
					}
				}
			} else {
				msg.channel.createMessage(':question: │ Missing `<command | file>` option.');
			}
		});
	}
};