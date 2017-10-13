const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = {
	interval: 12e4,
	execute: (bot, r) => {
		r.table("intervals").get("reset").run((error, response) => {
			if (error) return handleDatabaseError(error);
			if (Date.now() - response.timestamp > (1000 * 60 * 60 * 24 * 15)) {
				r.table("leaderboard").delete().run((error) => {
					if (error) return handleDatabaseError(error);
					r.table("intervals").get("reset").update({timestamp: Date.now()}).run((error) => {
						if (error) return handleDatabaseError(error);
					});
				});
			}
		});
	}
};