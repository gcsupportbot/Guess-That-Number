const log = require("../managers/logger.js");
const fs = require("fs");
const handleDatabaseError = require("../functions/handle-database-error.js");
const updatePresence = require("../functions/update-presence.js");
const updateSites = require("../functions/update-sites.js");
const config = require("../config.json");
const humanizeduration = require("humanize-duration");
const generateWebsiteStats = require("../functions/generate-website-stats.js");
const util = require("util");
const express = require("express");
const bodyParser = require("body-parser");

module.exports = (bot, r) => {
    bot.on("ready", () => {
        log(bot.user.username + " is ready!");
        bot.startuptime = Date.now();
        updatePresence(bot);
        updateSites(bot);
        process.on("unhandledRejection", (error, promise) => {
            if (error.name === "DiscordAPIError") {
                if (error.code === 50013) return;
                if (error.code === 50001) return;
                if (error.code === 50007) return;
            }
            console.error("Unhandled rejection caught.", error);
        });
        process.on("uncaughtException", console.error);
        r.table("restart").run((error, response) => {
            if (error) return handleDatabaseError(error);
            if (response.length > 0) {
                if (bot.channels.get(response[0].channelID)) bot.channels.get(response[0].channelID).send({
                    embed: {
                        title: "Restarted!",
                        color: 3066993,
                        description: "Took `" + humanizeduration(Date.now() - response[0].time) + "`."
                    }
                });
                r.table("restart").delete().run((error) => {
                    if (error) handleDatabaseError(error);
                });
            }
        });
        r.table("toggle").run((error, response) => {
            if (error) return handleDatabaseError(error);
            response.map((u) => {
                if (bot.users.get(u.userID)) bot.users.get(u.userID).data = {
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
                if (bot.guilds.get(v.serverID)) bot.guilds.get(v.serverID).data = {
                    prefix: v.prefix
                };
            });
        });
        if (bot.shard.id === 0) {
            const app = express();
            app.use(bodyParser.json());
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
                if (error) throw new error;
                log("Express server listening on port 82.");
            });
        }
    });
};