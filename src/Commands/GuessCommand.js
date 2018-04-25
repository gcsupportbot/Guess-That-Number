const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const updateUserStats = require('../Util/updateUserStats');

class Guess extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'guess',
			aliases: [
				'g'
			],
			description: 'Guesses a number in your game.',
			category: 'Game',
			usage: 'guess <number>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
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
			if (args.length < 1) return msg.channel.createMessage({
				embed: {
					title: 'Error!',
					color: 0xE50000,
					description: 'Missing `<number>` option.',
					footer: {
						text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
					}
				}
			});
			const guess = Number(args[0].replace(/,/g, ''));
			if (isNaN(guess)) return msg.channel.createMessage({
				embed: {
					title: 'Error!',
					color: 0xE50000,
					description: 'The guessing number must be a valid number.',
					footer: {
						text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
					}
				}
			});
			const max = ((response.difficulty === 1) ? 10000 : ((response.difficulty === 2) ? 100000 : ((response.difficulty === 3) ? 1000000 : 100000)));
			if (guess < 1 || guess > max) return msg.channel.createMessage({
				embed: {
					title: 'Error!',
					color: 0xE50000,
					description: 'The guessing amount cannot be above `' + String(max).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '` or below `1`.',
					footer: {
						text: 'Requested by ' + msg.author.username + '#' + msg.author.discriminator
					}
				}
			});
			this.r.table('games').get(msg.author.id).update({
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
						if (this.bot.toggle.has(msg.author.id)) {
							this.r.table('toggle').get(msg.author.id).delete().run((error) => {
								if (error) return handleDatabaseError(error, msg);
								this.bot.toggle.delete(msg.author.id);
								sendMessage(coinsAwarded);
							});
						} else {
							sendMessage(coinsAwarded);
						}
					};
					this.r.table('games').get(msg.author.id).delete().run((error) => {
						if (error) return handleDatabaseError(error, msg);
						updateUserStats(this.r, msg, response).then((coinsAwarded) => {
							this.r.table('leaderboard').filter({ userID: msg.author.id, difficulty: response.difficulty }).run((error, response2) => {
								if (error) return handleDatabaseError(error, msg);
								if (response2.length > 0) {
									if ((response.score + 1) < response2.score) return this.r.table('leaderboard').filter({ userID: msg.author.id, difficulty: response.difficulty }).update({ score: response.score + 1 }).run((error) => {
										if (error) return handleDatabaseError(error, msg);
										handleToggle(coinsAwarded);
									});
									this.r.table('leaderboard').filter({ userID: msg.author.id, difficulty: response.difficulty }).update({ score: response.score + 1 }).run((error) => {
										if (error) return handleDatabaseError(error, msg);
										handleToggle(coinsAwarded);
									});
								} else {
									this.r.table('leaderboard').insert({
										userID: msg.author.id,
										score: response.score + 1,
										difficulty: response.difficulty
									}).run((error) => {
										if (error) return handleDatabaseError(error, msg);
										handleToggle(coinsAwarded);
									});
								}
							});
						}).catch((error) => {
							handleDatabaseError(error, msg);
						});
					});
				}
			});
		});
	}
}

module.exports = Guess;