const handleDatabaseError = require('../util/handleDatabaseError.js');
const updateUserStats = require('../util/updateUserStats.js');
const humanizeduration = require('humanize-duration');
const config = require('../config.json');

module.exports = {
	command: 'guess',
	aliases: [
		'g'
	],
	category: 'Game',
	description: 'Guess a number in your game.',
	usage: 'guess <number>',
	execute: (bot, r, msg, args) => {
		r.table('games').get(msg.author.id).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (response) {
				if (args.length > 0) {
					const guess = Number(args[0].replace(/,/g, ''));
					if (isNaN(guess)) {
						msg.channel.createMessage({
							embed: {
								title: 'Error!',
								color: 0xE50000,
								description: 'The guessing number must be a valid number.',
								footer: {
									text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
								}
							}
						});
					} else {
						const max = ((response.difficulty === 1) ? 10000 : ((response.difficulty === 2) ? 100000 : ((response.difficulty === 3) ? 1000000 : 100000)));
						if (guess >= 1 && guess <= max) {
							r.table('games').get(msg.author.id).update({
								score: response.score + 1
							}).run((error) => {
								if (error) return handleDatabaseError(error, msg);
								if (guess > response.number) {
									msg.channel.createMessage({
										embed: {
											title: 'Lower!',
											color: 3066993,
											description: 'The number is lower than `' + String(guess).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '`.',
											footer: {
												text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator + ' | Guess #' + (response.score + 1)
											}
										}
									});
								} else if (guess < response.number) {
									msg.channel.createMessage({
										embed: {
											title: 'Higher!',
											color: 3066993,
											description: 'The number is higher than `' + String(guess).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '`.',
											footer: {
												text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator + ' | Guess #' + (response.score + 1)
											}
										}
									});
								} else if (guess === response.number) {
									const sendMessage = (coinsAwarded) => {
										msg.channel.createMessage({
											embed: {
												title: 'You guessed the correct number!',
												color: 3066993,
												description: 'The number was `' + response.number + '`.\n\nYou guessed `' + (response.score + 1) + '` times before ending the game.\n\nThe game was active for `' + humanizeduration(Date.now() - response.start_time, {
													round: true
												}) + '`.\n\nAdditionally, you have been awarded ' + coinsAwarded + ' coins to use in the shop.',
												footer: {
													text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
												}
											}
										});
									};
									const handleToggle = (coinsAwarded) => {
										if (bot.toggle.has(msg.author.id)) {
											r.table('toggle').get(msg.author.id).delete().run((error) => {
												if (error) return handleDatabaseError(error, msg);
												bot.toggle.delete(msg.author.id);
												sendMessage(coinsAwarded);
											});
										} else {
											sendMessage(coinsAwarded);
										}
									};
									r.table('games').get(msg.author.id).delete().run((error) => {
										if (error) return handleDatabaseError(error, msg);
										updateUserStats(r, msg, response, (error, coinsAwarded) => {
											if (error) return handleDatabaseError(error, msg);
											r.table('leaderboard').filter({ userID: msg.author.id, difficulty: response.difficulty }).run((error, response2) => {
												if (error) return handleDatabaseError(error, msg);
												if (response2.length > 0) {
													if ((response.score + 1) < response2.score) {
														r.table('leaderboard').filter({ userID: msg.author.id, difficulty: response.difficulty }).update({ score: response.score + 1 }).run((error) => {
															if (error) return handleDatabaseError(error, msg);
															handleToggle(coinsAwarded);
														});
													} else {
														r.table('leaderboard').filter({ userID: msg.author.id, difficulty: response.difficulty }).update({ score: response.score + 1 }).run((error) => {
															if (error) return handleDatabaseError(error, msg);
															handleToggle(coinsAwarded);
														});
													}
												} else {
													r.table('leaderboard').insert({
														userID: msg.author.id,
														score: response.score + 1,
														difficulty: response.difficulty
													}).run((error) => {
														if (error) return handleDatabaseError(error, msg);
														handleToggle(coinsAwarded);
													});
												}
											});
										});
									});
								}
							});
						} else {
							msg.channel.createMessage({
								embed: {
									title: 'Error!',
									color: 0xE50000,
									description: 'The guessing amount cannot be above `' + String(max).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '` or below `1`.',
									footer: {
										text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
									}
								}
							});
						}
					}
				} else {
					msg.channel.createMessage({
						embed: {
							title: 'Error!',
							color: 0xE50000,
							description: 'Missing `<number>` option.',
							footer: {
								text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
							}
						}
					});
				}
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