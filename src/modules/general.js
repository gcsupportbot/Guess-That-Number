const humanizeDuration = require('humanize-duration');
const config = require('../config.json');
const handleDatabaseError = require('../util/handleDatabaseError.js');

module.exports = {
	name: 'General',
	description: 'Commands that have to do with the bot itself.',
	visible: true,
	commands: [
		{
			command: 'donate',
			description: 'Get the donation links to support the creator.',
			aliases: [
				'patreon'
			],
			usage: 'donate',
			execute: (bot, r, msg) => {
				msg.channel.createMessage({
					embed: {
						title: 'Donation Rewards',
						color: 3066993,
						description: 'Donating will help the bot stay alive, and significantly improve it\'s performance when performing various tasks. Donating will also give you some sweet perks within our bots, as listed below.'
							+ '\n\n**Tier 1 - $2**\n```md\n* Custom Donator role on the official support server\n* Access to the donator-only chat on the official support server```'
							+ '\n**Tier 2 - $5**\n```md\n* All previous rewards.\n* A custom command for only you to use! (Prisma)\n* Ability to adjust volume higher than 100%. (Prisma)\n* Ability to infinitely repeat a song. (Prisma)```'
							+ '\n**Tier 3 - $10**\n```md\n* All previous rewards.\n* A second custom command. (Prisma)\n* Your custom command will now be public. (Prisma)\n* Queue limit increased from 25 to 100. (Prisma)\n* Song length limit increased from 30 minutes to 6 hours. (Prisma)```'
							+ '\n**Tier 4 - $15**\n```md\n* All previous rewards.\n* Your best leaderboard scores won\'t be removed when the reset occurs. (Guess That Number)```'
							+ '\n**Tier 5 - $25**\n```md\n* There are no special rewards for this, but you will be greatly benefiting the developer and paying for the host.```'
							+ '\nYou can donate on Patreon using the following link: ' + config.links.patreon
					}
				});
			}
		},
		{
			command: 'help',
			description: 'Sends the help list to the user via Direct Message.',
			aliases: [],
			usage: 'help [command]',
			execute: (bot, r, msg, args) => {
				r.table('developers').get(msg.author.id).run((error, developer) => {
					if (error) return handleDatabaseError(error, msg);
					const modules = bot.modules.filter((m) => developer ? true : m.visible);
					if (args.length > 0) {
						const mod = modules.filter((m) => m.name.toLowerCase() === args.join(' ').toLowerCase())[0];
						if (mod) {
							msg.channel.createMessage({
								embed: {
									title: mod.name,
									color: 3066993,
									description: mod.description + '\n\n' + mod.commands.map((c) => '**' + c.usage + '**\n' + c.description).join('\n\n')
								}
							});
						} else {
							msg.channel.createMessage(':exclamation: │ Unable to find any modules by that name.');
						}
					} else {
						msg.channel.createMessage({
							embed: {
								title: 'Command List',
								color: 3066993,
								description: 'Use `' + (msg.channel.guild ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + 'help <module name>` to view commands in a specific module.\n\n' + modules.map((m) => '**' + m.name + '**\n' + m.description).join('\n\n')
							}
						});
					}
				});
			}
		},
		{
			command: 'ping',
			description: 'See how long it takes to ping the bot.',
			aliases: [],
			usage: 'ping',
			execute: (bot, r, msg) => {
				const start = Date.now();
				msg.channel.createMessage(':ping_pong: │ Pinging...').then((m) => m.edit(':ping_pong: │ Pong! It took `' + (Date.now() - start) + 'ms` to send this message.'));
			}
		},
		{
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
		},
		{
			command: 'prefix',
			aliases: [
				'prefix'
			],
			category: 'General',
			description: 'View the prefix for your server or change it to a new one.',
			usage: 'prefix [new prefix]',
			execute: (bot, r, msg, args) => {
				if (args.length > 0) {
					r.table('developers').get(msg.author.id).run((error, developer) => {
						if (error) return handleDatabaseError(error, msg);
						if (msg.channel.type === 1) return msg.channel.createMessage(':no_entry_sign: │ You cannot change the prefix in a Direct Message.');
						if (msg.member.permission.has('manageChannels') || msg.author.id === msg.channel.guild.ownerID || developer) {
							if (args.join(' ').length > 10) {
								msg.channel.createMessage(':no_entry_sign: │ The prefix cannot be longer than 10 characters.');
							} else {
								r.table('prefixes').get(msg.channel.guild.id).run((error, count) => {
									if (error) return handleDatabaseError(error, msg);
									if (count) {
										r.table('prefixes').get(msg.channel.guild.id).update({ prefix: args.join(' ') }).run((error) => {
											if (error) return handleDatabaseError(error, msg);
											bot.prefixes.set(msg.channel.guild.id, args.join(' '));
											msg.channel.createMessage(':thumbsup: │ Set this server\'s prefix to `' + args.join(' ') + '`. You can now use `' + args.join(' ') + 'help` to get a list of commands.');
										});
									} else {
										r.table('prefixes').insert({
											id: msg.channel.guild.id,
											prefix: args.join(' ')
										}).run((error) => {
											if (error) return handleDatabaseError(error, msg);
											bot.prefixes.set(msg.channel.guild.id, args.join(' '));
											msg.channel.createMessage(':thumbsup:  │ Set this server\'s prefix to `' + args.join(' ') + '`. You can now use `' + args.join(' ') + 'help` to get a list of commands.');
										});
									}
								});
							}
						} else {
							msg.channel.createMessage(':no_entry_sign: │ You do not have permission to change this server\'s prefix. You need to have `Manage Channels` permission.');
						}
					});
				} else {
					msg.channel.createMessage(':pencil: │ The prefix for this server is `' + (msg.channel.guild ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + '` or `@' + bot.user.username + '#' + bot.user.discriminator + '`.');
				}
			}
		},
		{
			command: 'server',
			description: 'Join the official support server.',
			aliases: [
				'support',
				'feedback'
			],
			usage: 'server',
			execute: (bot, r, msg) => {
				msg.channel.createMessage(':tada: │ Come hang out with us in the official support server, or just suggest something for the bot. ' + config.links.server);
			}
		},
		{
			command: 'statistics',
			description: 'View bot statistics or information about a user.',
			aliases: [
				'stats',
				'stat',
				'info',
				'about'
			],
			usage: 'stats [@user | user ID | "commands"]',
			execute: (bot, r, msg) => {
				r.table('games').count().run((error, games) => {
					if (error) return handleDatabaseError(error);
					msg.channel.createMessage({
						embed: {
							title: 'Bot Statistics',
							color: 3066993,
							fields: [
								{
									name: 'Servers',
									value: bot.guilds.size.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,'),
									inline: true
								},
								{
									name: 'Users',
									value: bot.users.size.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,'),
									inline: true
								},
								{
									name: 'Active Games',
									value: games,
									inline: true
								},
								{
									name: 'Memory Usage',
									value: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + ' MB',
									inline: true
								},
								{
									name: 'Modules',
									value: bot.modules.size,
									inline: true
								},
								{
									name: 'Uptime',
									value: humanizeDuration(Date.now() - bot.startTime, {
										language: 'shortEn',
										spacer: '',
										delimiter: '',
										round: true,
										languages: {
											shortEn: {
												y: 'y',
												mo: 'mo',
												w: 'w',
												d: 'd',
												h: 'h',
												m: 'm',
												s: 's',
												ms: 'ms',
											}
										}
									}),
									inline: true
								}
							]
						}
					});
				});
			}
		}
	]
};