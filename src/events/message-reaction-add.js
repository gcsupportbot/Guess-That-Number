const config = require("../config.json");
const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = (bot, r) => {
	bot.on("messageReactionAdd", (reaction, user) => {
		if (reaction._emoji.name === "❌") {
			if (config.trusted.indexOf(user.id) === -1) return;
			if (reaction.message.author.id === bot.user.id) {
				reaction.message.delete().catch(() => {
					reaction.message.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "Failed to delete message."
						}
					});
				});
			}
		} else {
			if (user.data && user.data.leaderboardpages) {
				if (reaction._emoji.name === "⬅" && user.data.leaderboardpages.page === 1) return;
				if (reaction._emoji.name === "➡") user.data.leaderboardpages.page++;
				if (reaction._emoji.name === "⬅") user.data.leaderboardpages.page--;
				if (reaction._emoji.name !== "⬅" && reaction._emoji.name !== "➡") return;
				try {
					r.table("leaderboard").filter({ difficulty: user.data.leaderboardpages.difficulty }).orderBy(r.asc("score")).run((error, response) => {
						if (error) return handleDatabaseError(error, reaction.message);
						response = response.map((i) => {
							i.tag = bot.users.get(i.id) && bot.users.get(i.id).username + "#" + bot.users.get(i.id).discriminator;
							return i;
						}).filter((v) => v.tag);
						reaction.message.edit({
							embed: {
								title: "Global Leaderboard",
								description: response.length + " users have played " + ((user.data.leaderboardpages.difficulty === 1) ? "easy" : ((user.data.leaderboardpages.difficulty === 2) ? "medium" : ((user.data.leaderboardpages.difficulty === 3) ? "hard" : "unknown"))) + " difficulty.",
								color: 3066993,
								fields: response.slice((user.data.leaderboardpages.page * 10) - 10, user.data.leaderboardpages.page * 10).map((v) => {
									return {
										name: (response.indexOf(v) + 1) + ". " + v.tag,
										value: "Score: " + v.score,
										inline: false
									};
								}),
								footer: {
									text: "Page " + user.data.leaderboardpages.page + " / " + Math.ceil(response.length / 10)
								}
							}
						});
					});
				} catch (e) {
					reaction.message.channel.send({
						embed: {
							title: "Error!",
							color: 0xE50000,
							description: "Failed to switch pages on global leaderboard."
						}
					});
					console.error("Failed to switch pages on global leaderboard.", e);
				}
			}
		}
	});
};