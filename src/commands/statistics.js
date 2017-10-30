const handleDatabaseError = require("../functions/handle-database-error.js");
const humanizeduration = require("humanize-duration");

module.exports = {
	commands: [
		"statistics",
		"stats",
		"stat",
		"info",
		"about"
	],
	usage: "stats [@user | user ID | \"commands\"]",
	description: "View bot statistics or information about a user.",
	category: "Information",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			let user = msg.author;
			if (args) {
				const match = /^\d+$/.test(args[0]);
				if (/(?:<@)\d+(?:>)/.test(args[0])) {
					const usercheck = msg.channel.guild.members.get(args[0].match(/\d+/)[0]);
					if (usercheck) {
						user = usercheck;
					} else {
						return msg.channel.createMessage({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "I do not know who `" + args.join(" ") + "` is."
							}
						});
					}
				} else if (match) {
					const usercheck = msg.channel.guild.members.get(args[0]);
					if (usercheck) {
						user = usercheck;
					} else {
						return msg.channel.createMessage({
							embed: {
								title: "Error!",
								color: 0xE50000,
								description: "I do not know who `" + args.join(" ") + "` is."
							}
						});
					}
				} else {
					if (/.{2,32}#\d{4}/.test(args.join(" "))) {
						const match = args.join(" ").split("#");
						const usercheck = bot.users.filter((u) => u.username === match[0] && u.discriminator === match[1]);
						if (usercheck.size) {
							user = usercheck.first();
						} else {
							return msg.channel.createMessage({
								embed: {
									title: "Error!",
									color: 0xE50000,
									description: "I do not know who `" + args.join(" ") + "` is."
								}
							});
						}
					} else {
						const usercheck = bot.users.filter((u) => u.username.toLowerCase() === args.join(" ").toLowerCase());
						if (usercheck.size) {
							user = usercheck.first();
						} else {
							return msg.channel.createMessage({
								embed: {
									title: "Error!",
									color: 0xE50000,
									description: "I do not know who `" + args.join(" ") + "` is."
								}
							});
						}
					}
				}
			}
			if (user.bot) return msg.channel.createMessage({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Bots are not able to play this game, so they do not have statistics."
				}
			});
			r.table("leaderboard").filter({ userID: user.id }).run((error, leaderboard) => {
				if (error) return handleDatabaseError(error, msg);
				r.table("user_statistics").get(user.id).run((error, stats) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.createMessage({
						embed: {
							title: "User Statistics - " + user.username + "#" + user.discriminator,
							color: 3066993,
							fields: [
								{
									name: "Easy Games",
									value: ((stats) ? stats.easy_games_played : 0),
									inline: true
								},
								{
									name: "Medium Games",
									value: ((stats) ? stats.medium_games_played : 0),
									inline: true
								},
								{
									name: "Hard Games",
									value: ((stats) ? stats.hard_games_played : 0),
									inline: true
								},
								{
									name: "Easy Avg. Guesses",
									value: ((stats) ? ((stats.easy_guesses !== 0) ? (stats.easy_guesses / stats.easy_games_played).toFixed(1) : "0") : 0),
									inline: true
								},
								{
									name: "Medium Avg. Guesses",
									value: ((stats) ? ((stats.medium_guesses !== 0) ? (stats.medium_guesses / stats.medium_games_played).toFixed(1) : "0") : 0),
									inline: true
								},
								{
									name: "Hard Avg. Guesses",
									value: ((stats) ? ((stats.hard_guesses !== 0) ? (stats.hard_guesses / stats.hard_games_played).toFixed(1) : "0") : 0),
									inline: true
								},
								{
									name: "Easy Best Score",
									value: ((stats) ? ((leaderboard.filter((r) => r.difficulty === 1).length > 0) ? leaderboard.filter((r) => r.difficulty === 1)[0].score : "Unknown") : "Unknown"),
									inline: true
								},
								{
									name: "Medium Best Score",
									value: ((stats) ? ((leaderboard.filter((r) => r.difficulty === 2).length > 0) ? leaderboard.filter((r) => r.difficulty === 2)[0].score : "Unknown") : "Unknown"),
									inline: true
								},
								{
									name: "Hard Best Score",
									value: ((stats) ? ((leaderboard.filter((r) => r.difficulty === 3).length > 0) ? leaderboard.filter((r) => r.difficulty === 3)[0].score : "Unknown") : "Unknown"),
									inline: true
								},
								{
									name: "Easy Avg. Game Time",
									value: ((stats) ? humanizeduration(stats.easy_game_time / stats.easy_games_played, {
										language: "shortEn",
										spacer: "",
										delimiter: "",
										round: true,
										languages: {
											shortEn: {
												y: "y",
												mo: "mo",
												w: "w",
												d: "d",
												h: "h",
												m: "m",
												s: "s",
												ms: "ms",
											}
										}
									}) : "0s"),
									inline: true
								},
								{
									name: "Medium Avg. Game Time",
									value: ((stats) ? humanizeduration(stats.medium_game_time / stats.medium_games_played, {
										language: "shortEn",
										spacer: "",
										delimiter: "",
										round: true,
										languages: {
											shortEn: {
												y: "y",
												mo: "mo",
												w: "w",
												d: "d",
												h: "h",
												m: "m",
												s: "s",
												ms: "ms",
											}
										}
									}) : "0s"),
									inline: true
								},
								{
									name: "Hard Avg. Game Time",
									value: ((stats) ? humanizeduration(stats.hard_game_time / stats.hard_games_played, {
										language: "shortEn",
										spacer: "",
										delimiter: "",
										round: true,
										languages: {
											shortEn: {
												y: "y",
												mo: "mo",
												w: "w",
												d: "d",
												h: "h",
												m: "m",
												s: "s",
												ms: "ms",
											}
										}
									}) : "0s"),
									inline: true
								}
							]
						}
					});
				});
			});
		} else {
			r.table("games").count().run((error, activegames) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage({
					embed: {
						title: "Bot Statistics",
						color: 3066993,
						fields: [
							{
								name: "Servers",
								value: bot.guilds.size.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,"),
								inline: true
							},
							{
								name: "Users",
								value: bot.users.size.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,"),
								inline: true
							},
							{
								name: "Active Games",
								value: activegames.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,"),
								inline: true
							},
							{
								name: "Memory Usage",
								value: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + " MB",
								inline: true
							},
							{
								name: "Commands",
								value: Object.keys(bot.commands).length,
								inline: true
							},
							{
								name: "Uptime",
								value: humanizeduration(Date.now() - bot.startuptime, {
									language: "shortEn",
									spacer: "",
									delimiter: "",
									round: true,
									languages: {
										shortEn: {
											y: "y",
											mo: "mo",
											w: "w",
											d: "d",
											h: "h",
											m: "m",
											s: "s",
											ms: "ms",
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
};