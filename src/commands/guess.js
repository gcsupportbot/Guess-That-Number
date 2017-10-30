const handleDatabaseError = require("../functions/handle-database-error.js");
const updateUserStats = require("../functions/update-user-stats.js");
const humanizeduration = require("humanize-duration");
const config = require("../config.json");

module.exports = {
	commands: [
		"guess",
		"g"
	],
	usage: "guess <number>",
	description: "Guess a number in your game.",
	category: "Game",
	hidden: false,
	execute: (bot, r, msg, args) => {
		r.table("games").get(msg.author.id).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (response) {
				if (args.length > 0) {
					const guess = Number(args[0].replace(/,/g, ""));
					if (isNaN(guess)) {
						msg.channel.createMessage({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "The guessing number must be a valid number.",
								footer: {
									text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
								}
							}
						});
					} else {
						const max = ((response.difficulty === 1) ? 10000 : ((response.difficulty === 2) ? 100000 : ((response.difficulty === 3) ? 1000000 : 100000)));
						if (guess >= 1 && guess <= max) {
							r.table("games").get(msg.author.id).update({
								score: response.score + 1
							}).run((error) => {
								if (error) return handleDatabaseError(error, msg);
								if (guess > response.number) {
									msg.channel.createMessage({
										embed: {
											title: "Lower!",
											color: 3066993,
											description: "The number is lower than `" + String(guess).replace(/(.)(?=(\d{3})+$)/g, "$1,") + "`.",
											footer: {
												text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
											}
										}
									});
								} else if (guess < response.number) {
									msg.channel.createMessage({
										embed: {
											title: "Higher!",
											color: 3066993,
											description: "The number is higher than `" + String(guess).replace(/(.)(?=(\d{3})+$)/g, "$1,") + "`.",
											footer: {
												text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
											}
										}
									});
								} else if (guess === response.number) {
									r.table("games").get(msg.author.id).delete().run((error) => {
										if (error) return handleDatabaseError(error, msg);
										updateUserStats(r, msg, response, (error) => {
											if (error) return handleDatabaseError(error, msg);
											r.table("leaderboard").filter({ userID: msg.author.id, difficulty: response.difficulty }).run((error, response2) => {
												if (error) return handleDatabaseError(error, msg);
												if (response2.length > 0) {
													if ((response.score + 1) < response2.score) {
														r.table("leaderboard").filter({ userID: msg.author.id, difficulty: response.difficulty }).update({ score: response.score + 1 }).run((error) => {
															if (error) return handleDatabaseError(error, msg);
															if (msg.author.data && msg.author.data.toggle) {
																r.table("toggle").get(msg.author.id).delete().run((error) => {
																	if (error) return handleDatabaseError(error, msg);
																	msg.author.data.toggle = false;
																	msg.channel.createMessage({
																		embed: {
																			title: "You guessed the correct number!",
																			color: 306993,
																			description: "The number was `" + response.number + "`.\n\nYou guessed `" + (response.score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response.start_time, {
																				round: true
																			}) + "`.",
																			footer: {
																				text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
																			}
																		}
																	});
																});
															} else {
																msg.channel.createMessage({
																	embed: {
																		title: "You guessed the correct number!",
																		color: 3066993,
																		description: "The number was `" + response.number + "`.\n\nYou guessed `" + (response.score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response.start_time, {
																			round: true
																		}) + "`.",
																		footer: {
																			text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
																		}
																	}
																});
															}
														});
													} else {
														r.table("leaderboard").filter({ userID: msg.author.id, difficulty: response.difficulty }).update({ score: response.score + 1 }).run((error) => {
															if (error) return handleDatabaseError(error, msg);
															if (msg.author.data && msg.author.data.toggle) {
																r.table("toggle").get(msg.author.id).delete().run((error) => {
																	if (error) return handleDatabaseError(error, msg);
																	msg.author.data.toggle = false;
																	msg.channel.createMessage({
																		embed: {
																			title: "You guessed the correct number!",
																			color: 3066993,
																			description: "The number was `" + response.number + "`.\n\nYou guessed `" + (response.score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response.start_time, {
																				round: true
																			}) + "`.",
																			footer: {
																				text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
																			}
																		}
																	});
																});
															} else {
																msg.channel.createMessage({
																	embed: {
																		title: "You guessed the correct number!",
																		color: 3066993,
																		description: "The number was `" + response.number + "`.\n\nYou guessed `" + (response.score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response.start_time, {
																			round: true
																		}) + "`.",
																		footer: {
																			text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
																		}
																	}
																});
															}
														});
													}
												} else {
													r.table("leaderboard").insert({
														userID: msg.author.id,
														score: response.score + 1,
														difficulty: response.difficulty
													}).run((error) => {
														if (error) return handleDatabaseError(error, msg);
														if (msg.author.data && msg.author.data.toggle) {
															r.table("toggle").get(msg.author.id).delete().run((error) => {
																if (error) return handleDatabaseError(error, msg);
																msg.author.data.prefix = false;
																msg.channel.createMessage({
																	embed: {
																		title: "You guessed the correct number!",
																		color: 306993,
																		description: "The number was `" + response.number + "`.\n\nYou guessed `" + (response.score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response.start_time, {
																			round: true
																		}) + "`.",
																		footer: {
																			text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
																		}
																	}
																});
															});
														} else {
															msg.channel.createMessage({
																embed: {
																	title: "You guessed the correct number!",
																	color: 3066993,
																	description: "The number was `" + response.number + "`.\n\nYou guessed `" + (response.score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response.start_time, {
																		round: true
																	}) + "`.",
																	footer: {
																		text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
																	}
																}
															});
														}
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
									title: "Error!",
									color: 0xE50000,
									description: "The guessing amount cannot be above `" + String(max).replace(/(.)(?=(\d{3})+$)/g, "$1,") + "` or below `1`.",
									footer: {
										text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
									}
								}
							});
						}
					}
				} else {
					msg.channel.createMessage({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "Missing `<number>` option.",
							footer: {
								text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
							}
						}
					});
				}
			} else {
				msg.channel.createMessage({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "You're not in a game. To start one, use `" + ((msg.channel.guild) ? bot.prefixes[msg.channel.guild.id] : config.prefix) + "start`.",
						footer: {
							text: "Requested by " + msg.author.username + "#" + msg.author.discriminator
						}
					}
				});
			}
		});
	}
};