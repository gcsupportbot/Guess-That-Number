const handleDatabaseError = require("../functions/handle-database-error.js");
const config = require("../config.json");

module.exports = {
	commands: [
		"start",
		"s"
	],
	usage: "start [\"easy\" | \"medium\" | \"hard\"]",
	description: "Start a new game.",
	category: "Game",
	hidden: false,
	execute: (bot, r, msg, args) => {
		r.table("games").get(msg.author.id).run((error, response) => {
			if (error) return handleDatabaseError(error, msg);
			if (response.length === 0) {
				let difficulty = NaN;
				if (args.length > 0) {
					if (args[0] === "easy") difficulty = 1;
					if (args[0] === "medium") difficulty = 2;
					if (args[0] === "hard") difficulty = 3;
				} else {
					difficulty = 2;
				}
				if (!isNaN(difficulty)) {
					const max = ((difficulty === 1) ? 10000 : ((difficulty === 2) ? 100000 : ((difficulty === 3) ? 1000000 : 100000)));
					r.table("games").insert({
						id: msg.author.id,
						score: 0,
						number: Math.floor(Math.random() * max),
						start_time: Date.now(),
						difficulty
					}).run((error) => {
						if (error) return handleDatabaseError(error, msg);
						msg.channel.send({
							embed: {
								title: "You started a new game!",
								color: 3066993,
								description: "Use `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "guess <number>` to guess a number.\n\nThe numbers range from `1 to " + String(max).replace(/(.)(?=(\d{3})+$)/g, "$1,") + "`.\n\nYou will be given a hint every time you guess, that will say either 'higher' or 'lower'.\n\nGood luck!"
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
			} else {
				msg.channel.send({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "You already have a game in-progress."
					}
				});
			}
		});
	}
};