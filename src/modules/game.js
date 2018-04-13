const humanizeDuration = require('humanize-duration');
const dateformat = require('dateformat');
const handleDatabaseError = require('../util/handleDatabaseError.js');
const config = require('../config.json');
const updateUserStats = require('../util/updateUserStats.js');

module.exports = {
	name: 'Game',
	description: 'Any commands that have to do with the game will be here.',
	visible: true,
	commands: [
		{
			command: 'end',
			description: 'End your current game.',
			aliases: [
				'end',
				'stop',
				'quit',
				'e'
			],
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
											description: 'The correct number is `' + response.number + '`.\n\nYou guessed `' + response.score + '` times before ending the game.\n\nThe game was active for `' + humanizeDuration(Date.now() - response.start_time, {
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
										description: 'The correct number is `' + response.number + '`.\n\nYou guessed `' + response.score + '` times before ending the game.\n\nThe game was active for `' + humanizeDuration(Date.now() - response.start_time, {
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
		},
		{
			command: 'guess',
			description: 'Guess a number in your game.',
			aliases: [
				'g'
			],
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
														description: 'The number was `' + response.number + '`.\n\nYou guessed `' + (response.score + 1) + '` times before ending the game.\n\nThe game was active for `' + humanizeDuration(Date.now() - response.start_time, {
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
		},
		{
			command: 'start',
			description: 'Start a new game.',
			aliases: [
				's'
			],
			usage: 'start ["easy" | "medium" | "hard"]',
			execute: (bot, r, msg, args) => {
				r.table('games').get(msg.author.id).run((error, response) => {
					if (error) return handleDatabaseError(error, msg);
					if (!response) {
						let difficulty = NaN;
						if (args.length > 0) {
							if (args[0] === 'easy') difficulty = 1;
							if (args[0] === 'medium') difficulty = 2;
							if (args[0] === 'hard') difficulty = 3;
						} else {
							difficulty = 2;
						}
						if (!isNaN(difficulty)) {
							const max = ((difficulty === 1) ? 10000 : ((difficulty === 2) ? 100000 : ((difficulty === 3) ? 1000000 : 100000)));
							r.table('games').insert({
								id: msg.author.id,
								score: 0,
								number: Math.floor(Math.random() * max),
								start_time: Date.now(),
								difficulty
							}).run((error) => {
								if (error) return handleDatabaseError(error, msg);
								msg.channel.createMessage({
									embed: {
										title: 'You started a new game!',
										color: 3066993,
										description: 'Use `' + ((msg.channel.guild) ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + 'guess <number>` to guess a number.\n\nThe numbers range from `1 to ' + String(max).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '`.\n\nYou will be given a hint every time you guess, that will say either \'higher\' or \'lower\'.\n\nGood luck!',
										footer: {
											text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
										}
									}
								});
							});
						} else {
							msg.channel.createMessage(':question: │ Unknown option, `' + args[0] + '`. Please use `easy`, `medium`, or `hard`.');
						}
					} else {
						msg.channel.createMessage(':question: │ You already have a game in-progress.');
					}
				});
			}
		},
		{
			command: 'toggle',
			description: 'Send guess as single message.',
			aliases: [
				'tog'
			],
			usage: 'toggle',
			execute: (bot, r, msg) => {
				r.table('games').get(msg.author.id).run((error, response) => {
					if (error) return handleDatabaseError(error, msg);
					if (response) {
						r.table('toggle').get(msg.author.id).run((error, response) => {
							if (error) return handleDatabaseError(error, msg);
							if (response) {
								r.table('toggle').get(msg.author.id).delete().run((error) => {
									if (error) return handleDatabaseError(error, msg);
									bot.toggle.delete(msg.author.id);
									msg.channel.createMessage(':pause_button: │ Turned off toggle mode.');
								});
							} else {
								r.table('toggle').insert({ id: msg.author.id }).run((error) => {
									if (error) return handleDatabaseError(error, msg);
									bot.toggle.set(msg.author.id, true);
									msg.channel.createMessage(':arrow_forward: │ All your messages that are numbers will be counted as a guess from now on.');
								});
							}
						});
					} else {
						msg.channel.createMessage(':question: │ You must be in a game to use this command. Start a game using `' + ((msg.channel.guild) ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + 'start`.');
					}
				});
			}
		},
		{
			command: 'shop',
			description: 'Buy an item from the shop using the money that you get from games.',
			aliases: [
				'store',
				'buy'
			],
			usage: 'shop [item name] [amount]',
			execute: (bot, r, msg) => {
				msg.channel.createMessage(':thinking: │ The developer of this bot currently is unable to think of anything to add to this shop. If you have an idea of what to put here, please suggest it here: ' + config.links.server);
			}
		},
		{
			command: 'leaderboard',
			description: 'View the server leaderboard.',
			aliases: [
				'scoreboard',
				'lb',
				'sb'
			],
			usage: 'leaderboard ["easy" | "medium" | "hard"]',
			execute: (bot, r, msg, args) => {
				let difficulty = NaN;
				if (args.length > 0) {
					if (args[0] === 'easy') {
						difficulty = 1;
					} else if (args[0] === 'medium') {
						difficulty = 2;
					} else if (args[0] === 'hard') {
						difficulty = 3;
					}
				} else {
					difficulty = 2;
				}
				if (!isNaN(difficulty)) {
					r.table('leaderboard').filter({ difficulty }).orderBy(r.asc('score')).without('id', 'difficulty').run((error, response) => {
						if (error) return handleDatabaseError(error, msg);
						response = response.map((i) => {
							i.tag = bot.users.get(i.userID) && bot.users.get(i.userID).username + '#' + bot.users.get(i.userID).discriminator;
							return i;
						}).filter((v) => v.tag);
						if (response.length > 0) {
							msg.channel.createMessage({
								embed: {
									title: 'Global Leaderboard',
									description: response.length + ' users have played ' + ((difficulty === 1) ? 'easy' : ((difficulty === 2) ? 'medium' : ((difficulty === 3) ? 'hard' : 'unknown'))) + ' difficulty.',
									color: 3066993,
									fields: response.slice(0, 10).map((v) => {
										return {
											name: (response.indexOf(v) + 1) + '. ' + v.tag,
											value: 'Score: ' + v.score,
											inline: false
										};
									}),
									footer: {
										text: 'Page 1 / ' + Math.ceil(response.length / 10)
									}
								}
							}).then((msgresponse) => {
								if (response.length < 11) return;
								setTimeout(() => {
									msgresponse.addReaction('⬅').then(() => {
										setTimeout(() => {
											msgresponse.addReaction('➡');
										}, 500);
										bot.leaderboardPages[msg.author.id] = {
											page: 1,
											messageID: msgresponse.id,
											difficulty
										};
									});
								}, 500);
							}).catch(() => { });
						} else {
							msg.channel.createMessage(':question: │ No users have played ' + ((difficulty === 1) ? 'easy' : ((difficulty === 2) ? 'medium' : ((difficulty === 3) ? 'hard' : 'unknown'))) + ' difficulty.');
						}
					});
				} else {
					msg.channel.createMessage(':question: │ Unknown option, `' + args[0] + '`. Please use `easy`, `medium`, or `hard`.');
				}
			}
		},
		{
			command: 'leaderboardreset',
			description: 'Check how long until the leaderboard resets.',
			aliases: [
				'scoreboardreset',
				'lbreset',
				'sbreset'
			],
			usage: 'leaderboardreset',
			execute: (bot, r, msg) => {
				r.table('intervals').get('reset').run((error, response) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.createMessage(':repeat: │ The leaderboard will reset in `' + humanizeDuration((1000 * 60 * 60 * 24 * 15) - (Date.now() - response.timestamp), {
						round: true
					}) + '`.');
				});
			}
		},
		{
			command: 'profile',
			description: 'View the profile of yourself or another user.',
			aliases: [],
			usage: 'profile [@user | userID | username]',
			execute: (bot, r, msg) => {
				r.table('user_statistics').get(msg.author.id).run((error, user) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.createMessage(':warning: │ Sorry, but recently the database was accidentally lost during a corruption of the hosts\'s OS. As a reward, all of the games within the next 2 weeks will be double coins. :heart_eyes:');
					msg.channel.createMessage({
						embed: {
							title: 'Your Profile',
							color: 3066993,
							thumbnail: {
								url: msg.author.avatarURL
							},
							description: 'You can purchase things to display on your profile within the `' + ((msg.channel.guild) ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + 'shop`.',
							fields: [
								{
									name: 'Coins',
									value: user ? user.coins : 0,
									inline: true
								}
							]
						}
					});
				});
			}
		},
		{
			command: 'raffle',
			description: 'Participate in the raffle by putting your coins in the pot.',
			aliases: [],
			usage: 'raffle [amount]',
			execute: (bot, r, msg, args) => {
				if (args.length > 0) {
					r.table('user_statistics').get(msg.author.id).run((error, user) => {
						if (error) return handleDatabaseError(error, msg);
						if (isNaN(args[0])) return msg.channel.createMessage(':exclamation: │ The bet amount must be a valid number.');
						if (Number(args[0]) < 50) return msg.channel.createMessage(':exclamation: │ You must bet at least 50 coins in order to raffle.');
						if (!user || Number(args[0]) > user.coins) return msg.channel.createMessage(':exclamation: │ You don\'t have that many coins to bet with.');
						r.table('user_statistics').get(msg.author.id).update({
							coins: user.coins - Number(args[0])
						}).run((error) => {
							if (error) return handleDatabaseError(error, msg);
							r.table('intervals').get('raffle').update({
								participants: r.row('participants').append({
									user: {
										username: msg.author.username,
										discriminator: msg.author.discriminator,
										id: msg.author.id
									},
									bet: Number(args[0]),
									timestamp: Date.now()
								})
							}).run((error) => {
								if (error) return handleDatabaseError(error, msg);
								msg.channel.createMessage(':moneybag: │ You\'ve successfully put ' + args[0] + ' coins into the raffle.');
							});
						});
					});
				} else {
					r.table('intervals').get('raffle').run((error, raffle) => {
						if (error) return handleDatabaseError(error, msg);
						msg.channel.createMessage({
							embed: {
								title: 'Raffle',
								description: 'Ends at: ' + dateformat(raffle.end_time, 'mm/dd/yyyy hh:MM:ss TT'),
								color: 3066993,
								fields: [
									{
										name: 'Participants',
										value: raffle.participants.length,
										inline: true
									},
									{
										name: 'Pot Size',
										value: raffle.participants.map((p) => p.bet).reduce((a, b) => a + b, 0).toLocaleString() + ' coins',
										inline: true
									},
									{
										name: 'Time Remaining',
										value: humanizeDuration(raffle.end_time - Date.now(), { round: true }),
										inline: true
									}
								],
								footer: {
									text: 'Use "' + (msg.channel.guild ? bot.prefixes.get(msg.channel.guild.id) : config.prefix) + 'raffle <amount>" to join the raffle.'
								}
							}
						});
					});
				}
			}
		}
	]
};