const handleDatabaseError = require('../util/handleDatabaseError.js');
const config = require('../config.json');
const humanizeduration = require('humanize-duration');

module.exports = {
	command: 'end',
	aliases: [
		'end',
		'stop',
		'quit',
		'e'
	],
	category: 'Game',
	description: 'End your current game.',
	usage: 'end',
	execute: (bot, r, msg) => {
		r.table('games').get(msg.author.id).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (response) {
				r.table('games').get(msg.author.id).delete().run((error) => {
					if (error) return handleDatabaseError(error, msg);
					if (bot.toggle.has(msg.author.id)) {
						r.table('toggle').get(msg.author.id).delete().run((error) => {
							if (error) return handleDatabaseError(error, msg);
							bot.toggle.delete(msg.author.id);
							msg.channel.createMessage({
								embed: {
									title: 'You force ended the game!',
									color: 3066993,
									description: 'The correct number is `' + response.number + '`.\n\nYou guessed `' + response.score + '` times before ending the game.\n\nThe game was active for `' + humanizeduration(Date.now() - response.start_time, {
										round: true
									}) + '`.',
									footer: {
										text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
									}
								}
							});
						});
					} else {
						msg.channel.createMessage({
							embed: {
								title: 'You force ended the game!',
								color: 3066993,
								description: 'The correct number is `' + response.number + '`.\n\nYou guessed `' + response.score + '` times before ending the game.\n\nThe game was active for `' + humanizeduration(Date.now() - response.start_time, {
									round: true
								}) + '`.',
								footer: {
									text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
								}
							}
						});
					}
				});
			} else {
				msg.channel.createMessage({
					embed: {
						title: 'Error!',
						color: 0xE50000,
						description: 'You\'re not in a game. To start one, use `' + ((msg.channel.guild) ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + 'start`.',
						footer: {
							text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
						}
					}
				});
			}
		});
	}
};