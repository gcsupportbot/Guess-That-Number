const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class End extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'end',
			aliases: [
				'e'
			],
			description: 'Ends your current game.',
			category: 'Game',
			usage: 'end',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		this.r.table('games').get(msg.author.id).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (!response) return msg.channel.createMessage({
				embed: {
					title: 'Error!',
					color: 0xE50000,
					description: 'You\'re not in a game. To start one, use `' + msg.prefix + 'start`.',
					footer: {
						text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
					}
				}
			});
			this.r.table('games').get(msg.author.id).delete().run((error) => {
				if (error) return handleDatabaseError(error, msg);
				if (!this.bot.toggle.has(msg.author.id)) return msg.channel.createMessage({
					embed: {
						title: 'You force ended the game!',
						color: 3066993,
						description: 'The correct number is `' + response.number + '`.\n\nYou guessed `' + response.score + '` times before ending the game.\n\nThe game was active for `' + humanizeDuration(Date.now() - response.start_time, {
							round: true
						}) + '`.',
						footer: {
							text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
						}
					}
				});
				this.r.table('toggle').get(msg.author.id).delete().run((error) => {
					if (error) return handleDatabaseError(error, msg);
					this.bot.toggle.delete(msg.author.id);
					msg.channel.createMessage({
						embed: {
							title: 'You force ended the game!',
							color: 3066993,
							description: 'The correct number is `' + response.number + '`.\n\nYou guessed `' + response.score + '` times before ending the game.\n\nThe game was active for `' + humanizeDuration(Date.now() - response.start_time, {
								round: true
							}) + '`.',
							footer: {
								text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
							}
						}
					});
				});
			});
		});
	}
}

module.exports = End;