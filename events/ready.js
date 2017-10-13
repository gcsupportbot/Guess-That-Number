const log = require("../managers/logger.js");
const handleDatabaseError = require("../functions/handle-database-error.js");
const updateSites = require("../functions/update-sites.js");
const config = require("../config.json");
const generateWebsiteStats = require("../functions/generate-website-stats.js");
const express = require("express");

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
				if (bot.users.get(u.userID)) bot.users.get(u.userID).data.toggle = true;
			});
		});
		bot.guilds.map((g) => {
			g.data = {};
			g.data.prefix = config.prefix;
		});
		r.table("prefixes").run((error, response) => {
			if (error) return handleDatabaseError(error);
			response.map((v) => {
				if (bot.guilds.get(v.serverID)) bot.guilds.get(v.serverID).data.prefix = v.prefix;
			});
		});
		if (bot.shard.id === 0) {
			const app = express();
			app.get("/stats", (req, res) => {
				generateWebsiteStats(bot, r).then((r) => res.send(r)).catch((error) => {
					console.error("Failed to generate website statistics.", error);
					res.send({
						error
					});
				});
			});
			app.get("/commands", (req, res) => {
				let commands = Object.keys(bot.commands).filter((c) => !bot.commands[c].hidden);
				let categorized = {};
				commands.map((c) => {
					if (!(bot.commands[c].category in categorized)) categorized[bot.commands[c].category] = [];
					categorized[bot.commands[c].category].push({
						usage: bot.commands[c].usage,
						command: bot.commands[c].commands[0],
						aliases: bot.commands[c].commands.slice(1),
						description: bot.commands[c].description
					});
				});
				res.send(categorized);
			});
			app.listen(82, (error) => {
				if (error) {
					if (error.code === "EADDRINUSE") return;
					throw new error;
				}
				log("Express server listening on port 82.");
			});
		}
	});
};