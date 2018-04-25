const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Prefix extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'prefix',
			aliases: [],
			description: 'View the prefix for your server or change it to a new one.',
			category: 'Utility',
			usage: 'prefix [<new prefix...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':pencil:   **»**   The prefix for this server is `' + msg.prefix + '` or `@' + this.bot.user.username + '#' + this.bot.user.discriminator + '`.');
		this.r.table('developers').get(msg.author.id).run((error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (msg.channel.type === 1) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot change the prefix in a direct message.');
			if (!msg.member.permission.has('manageChannels') && msg.author.id !== msg.channel.guild.ownerID || !developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to change this server\'s prefix. You need to have `Manage Channels` permission.');
			if (args.join(' ').length > 10) return msg.channel.createMessage(':exclamation:   **»**   The prefix cannot be longer than 10 characters.');
			this.r.table('prefixes').get(msg.channel.guild.id).run((error, count) => {
				if (error) return handleDatabaseError(error, msg);
				if (count) return this.r.table('prefixes').get(msg.channel.guild.id).update({ prefix: args.join(' ') }).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					this.bot.prefixes.set(msg.channel.guild.id, args.join(' '));
					msg.channel.createMessage(':thumbsup:   **»**   Set this server\'s prefix to `' + args.join(' ') + '`. You can now use `' + args.join(' ') + 'help` to get a list of commands.');
				});
				this.r.table('prefixes').insert({
					id: msg.channel.guild.id,
					prefix: args.join(' ')
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					this.bot.prefixes.set(msg.channel.guild.id, args.join(' '));
					msg.channel.createMessage(':thumbsup:   **»**   Set this server\'s prefix to `' + args.join(' ') + '`. You can now use `' + args.join(' ') + 'help` to get a list of commands.');
				});
			});
		});
	}
}

module.exports = Prefix;