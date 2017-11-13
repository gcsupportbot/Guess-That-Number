/* eslint-disable no-empty */

const log = require("../managers/logger.js");
const handleDatabaseError = require("../functions/handle-database-error.js");
const config = require("../config.json");
const dashboard = require("../website/index.js");

module.exports = (bot, r) => {
	bot.on("ready", () => {
		log(bot.user.username + " is ready!");
		bot.startuptime = Date.now();
		process.on("unhandledRejection", (error) => {
			console.log(require("util").inspect(error));
		});
		process.on("uncaughtException", console.error);
		r.table("toggle").run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((u) => {
				bot.toggle.push(u.id);
			});
		});
		bot.guilds.map((g) => {
			bot.prefixes[g.id] = config.prefix;
		});
		r.table("prefixes").run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((v) => {
				bot.prefixes[v.id] = v.prefix;
			});
		});
		dashboard(bot, r);
	});
};