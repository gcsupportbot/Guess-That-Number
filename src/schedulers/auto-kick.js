const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = {
	interval: (1000 * 60 * 60),
	execute: (bot, r) => {
		r.table("games").run((error, response) => {
			if (error) return handleDatabaseError(error);
			if (response.length !== 0) {
				response.forEach((index) => {
					if (Date.now() - index.start_time >= (1000 * 60 * 60 * 24)) {
						if (bot.users.get(index.id)) bot.users.get(index.id).getDMChannel().then((dm) => dm.createMessage("As of 12 hours ago, you started a " + ((index.difficulty === 1) ? "easy" : ((index.difficulty === 2) ? "medium" : ((index.difficulty === 3) ? "hard" : "unknown"))) + " difficulty game. To keep from getting too many active games, we have kicked you from it. If you would like to start another game, you may do so by running the `start` command again. Thank you."));
						r.table("games").get(index.id).delete().run((error) => {
							if (error) return handleDatabaseError(error);
							if (bot.toggle.indexOf(index.id) > -1) {
								r.table("toggle").get(index.id).delete().run((error) => {
									if (error) return handleDatabaseError(error);
									bot.toggle.splice(bot.toggle.indexOf(index.id), 1);
								});
							}
						});
					}
				});
			}
		});
	}
};