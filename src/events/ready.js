const log = require("../managers/logger.js");
const handleDatabaseError = require("../functions/handle-database-error.js");
const config = require("../config.json");
const dashboard = require("../website/index.js");

module.exports = (bot, r) => {
	bot.on("ready", () => {
		log(bot.user.username + " is ready!");
		bot.startuptime = Date.now();
		process.on("unhandledRejection", (error) => {
			if (error.name === "DiscordAPIError") {
				if (error.code === 50013) return;
				if (error.code === 50001) return;
				if (error.code === 50007) return;
			}
			console.error(error);
		});
		process.on("uncaughtException", console.error);
		r.table("toggle").run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((u) => {
				if (bot.users.get(u.id)) bot.users.get(u.id).data = {
					toggle: true
				};
			});
		});
		bot.guilds.map((g) => {
			g.data = {};
			g.data.prefix = config.prefix;
		});
		r.table("prefixes").run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((v) => {
				if (bot.guilds.get(v.id)) bot.guilds.get(v.id).data.prefix = v.prefix;
			});
		});
		dashboard(bot, r);
	});
};