const util = require('util');
const snekfetch = require('snekfetch');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const Eris = require('eris');
const formatArbitrary = require('../util/formatArbitrary.js');
const handleDatabaseError = require('../util/handleDatabaseError.js');
const Module = require('../structure/Module.js');

module.exports = {
	name: 'Developers',
	description: 'All the commands used specifically by the developers.',
	visible: false,
	commands: [
		{
			command: 'eval',
			description: 'Evaluate arbatrary code within the bot.',
			aliases: [],
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
		},
		{
			command: 'exec',
			description: 'Execute commands in the console.',
			aliases: [],
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
		},
		{
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
							fs.readdir(__dirname, (error, files) => {
								if (error) return msg.channel.createMessage(':exclamation: │ An unexpected error occured while reading modules directory.');
								for (let i = 0; i < files.length; i++) {
									delete require.cache[path.join(__dirname, files[i])];
									const mod = require(path.join(__dirname, files[i]));
									try {
										bot.modules.set(mod.name, new Module(mod, files[i]));
										if (i === files.length - 1) {
											msg.channel.createMessage(':arrows_counterclockwise: │ Successfully reloaded ' + files.length + ' modules.');
										}
									} catch (e) {
										msg.channel.createMessage(':exclamation: │ An error occured while trying to reload module.\n```js\n' + util.inspect(e) + '```');
									}
								}
							});
						} else {
							const filteredModules = bot.modules.filter((m) => m.name.toLowerCase() === args[0].toLowerCase());
							if (filteredModules.length < 1) return msg.channel.createMessage(':exclamation: │ Unable to find any modules by that name.');
							delete require.cache[path.join(__dirname, filteredModules[0].fileName)];
							try {
								const mod = require(path.join(__dirname, filteredModules[0].fileName));
								bot.modules.set(mod.name, new Module(mod, filteredModules[0].fileName));
								msg.channel.createMessage(':arrows_counterclockwise: │ Module `' + mod.name + '` has been reloaded.');
							} catch (e) {
								msg.channel.createMessage(':exclamation: │ An error occured while trying to reload command.\n```js\n' + util.inspect(e) + '```');
							}
						}
					} else {
						msg.channel.createMessage(':question: │ Missing `<command | file>` option.');
					}
				});
			}
		},
		{
			command: 'restart',
			description: 'Restarts the bot.',
			aliases: [
				'reboot'
			],
			usage: 'restart',
			execute: (bot, r, msg) => {
				r.table('developers').get(msg.author.id).run(async (error, developer) => {
					if (error) return handleDatabaseError(error, msg);
					if (!developer) return msg.channel.createMessage(':no_entry_sign: │ You do not have permission to execute this command.');
					msg.channel.createMessage(':arrows_counterclockwise: │ Automatically restarting the bot.').then(process.exit);
				});
			}
		},
		{
			command: 'testtoken',
			aliases: [
				'token'
			],
			category: 'Developers',
			description: 'Tests a Discord bot with a specified token.',
			usage: 'testtoken <token>',
			execute: (bot, r, msg, args) => {
				r.table('developers').get(msg.author.id).run((error, developer) => {
					if (error) return handleDatabaseError(error, msg);
					if (!developer) return msg.channel.createMessage(':no_entry_sign: │ You do not have permission to execute this command.');
					if (args.length < 1) return msg.channel.createMessage(':question: │ Missing `<token>` option.');
					msg.channel.createMessage(':mag: │ Logging in with token...').then((m) => {
						const client = new Eris(args[0]);
						client.on('ready', () => {
							m.edit(':white_check_mark: │ Successfully logged in as `' + client.user.username + '#' + client.user.discriminator + ' (' + client.user.id + ')`. Connected to ' + client.guilds.size + ' servers and ' + client.users.size + ' users.');
							client.disconnect({
								reconnect: false
							});
						});
						client.on('disconnect', () => {
							m.edit(':x: │ Failed to login to bot. Most likely an invalid token.');
						});
						client.connect();
					});
				});
			}
		}
	]
};