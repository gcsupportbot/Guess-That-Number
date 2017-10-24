const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = {
	commands: [
		"leaderboard",
		"scoreboard",
		"lb",
		"sb"
	],
	usage: "leaderboard [\"easy\" | \"medium\" | \"hard\"]",
	description: "View the server leaderboard.",
	category: "Game",
	hidden: false,
	execute: (bot, r, msg, args) => {
		let difficulty = NaN;
		if (args.length > 0) {
			if (args[0] === "easy") {
				difficulty = 1;
			} else if (args[0] === "medium") {
				difficulty = 2;
			} else if (args[0] === "hard") {
				difficulty = 3;
			}
		} else {
			difficulty = 2;
		}
		if (!isNaN(difficulty)) {
			r.table("leaderboard").filter({ difficulty }).orderBy(r.asc("score")).without("id", "difficulty").run((error, response) => {
				if (error) return handleDatabaseError(error, msg);
				console.log(response);
				bot.shard.broadcastEval(JSON.stringify(response.map((u) => {
					return {
						id: u.id,
						score: u.score
					};
				})) + ".map((u) => this.users.get(u.userID) && {id: u.userID, score: u.score, tag: this.users.get(u.userID).tag}).filter((a) => a)").then((response) => {
					console.log(response);
					response = [...new Set([].concat.apply([], response))];
					console.log(response);
					if (response.length > 0) {
						msg.channel.send({
							embed: {
								title: "Global Leaderboard",
								description: response.length + " users have played " + ((difficulty === 1) ? "easy" : ((difficulty === 2) ? "medium" : ((difficulty === 3) ? "hard" : "unknown"))) + " difficulty.",
								color: 3066993,
								fields: response.slice(0, 10).map((v) => {
									return {
										name: (response.indexOf(v) + 1) + ". " + v.tag,
										value: "Score: " + v.score,
										inline: false
									};
								}),
								footer: {
									text: "Page 1 / " + Math.ceil(response.length / 10)
								}
							}
						}).then((msgresponse) => {
							if (response.length < 11) return;
							setTimeout(() => {
								msgresponse.react("⬅").then(() => {
									setTimeout(() => {
										msgresponse.react("➡");
									}, 500);
									if (!msg.author.data) msg.author.data = {};
									msg.author.data.leaderboardpages = {
										page: 1,
										messageID: msgresponse.id,
										difficulty
									};
								});
							}, 500);
						}).catch(() => { });
					} else {
						msg.channel.send({
							embed: {
								title: "Global Leaderboard",
								color: 3066993,
								description: "No users have played " + ((difficulty === 1) ? "easy" : ((difficulty === 2) ? "medium" : ((difficulty === 3) ? "hard" : "unknown"))) + " difficulty."
							}
						});
					}
				});
			});
		} else {
			msg.channel.send({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "Unknown option, `" + args[0] + "`. Please use `easy`, `medium`, or `hard`."
				}
			});
		}
	}
};