const handleDatabaseError = require('../util/handleDatabaseError.js');
const config = require('../config.json');

module.exports = {
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
			msg.channel.createMessage(':pencil: │ The prefix for this server is `' + ((msg.channel.guild) ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + '` or `@' + bot.user.username + '#' + bot.user.discriminator + '`.');
		}
	}
};