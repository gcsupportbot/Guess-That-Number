const log = require("../managers/logger.js");
const fs = require("fs");
const handleDatabaseError = require("../functions/handle-database-error.js");
const updatePresence = require("../functions/update-presence.js");
const config = require("../config.json");
const humanizeduration = require("humanize-duration");
const generateWebsiteStats = require("../functions/generate-website-stats.js");
const util = require("util");
const express = require("express");
const bodyParser = require("body-parser");

module.exports = (bot, database) => {
    bot.on("ready", () => {
        log(bot.user.username + " is ready!");
        database.run("CREATE TABLE IF NOT EXISTS games (userID TEXT, score INT, number INT, start_time TEXT, difficulty TEXT)");
        database.run("CREATE TABLE IF NOT EXISTS leaderboard (userID TEXT, score INT, difficulty TEXT)");
        database.run("CREATE TABLE IF NOT EXISTS prefixes (serverID TEXT, prefix TEXT)");
        database.run("CREATE TABLE IF NOT EXISTS reset (timestamp TEXT)");
        database.run("CREATE TABLE IF NOT EXISTS restart (time TEXT, channelID TEXT)");
        database.run("CREATE TABLE IF NOT EXISTS toggle (userID TEXT)");
        database.run("CREATE TABLE IF NOT EXISTS user_statistics (userID TEXT, easy_games_played INT, medium_games_played INT, hard_games_played INT, easy_guesses INT, medium_guesses INT, hard_guesses INT, easy_game_time TEXT, medium_game_time TEXT, hard_game_time TEXT)");
        bot.startuptime = Date.now();
        updatePresence(bot);
        process.on("unhandledRejection", (error, promise) => {
            if (error.name === "DiscordAPIError") {
                if (error.code === 50013) return;
                if (error.code === 50001) return;
                if (error.code === 50007) return;
            }
            console.error(error);
            console.error(promise);
        });
        process.on("uncaughtException", console.error);
        database.all("SELECT * FROM restart", (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length > 0) {
                if (bot.channels.get(response[0].channelID)) bot.channels.get(response[0].channelID).send({
                    embed: {
                        title: "Restarted!",
                        color: 3066993,
                        description: "Took `" + humanizeduration(Date.now() - response[0].time) + "`."
                    }
                });
                database.run("DELETE FROM restart", (error) => {
                    if (error) handleDatabaseError(bot, error);
                });
            }
        });
        database.all("SELECT * FROM toggle", (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            response.map(u => {
                if (bot.users.get(u.userID)) bot.users.get(u.userID).data = {
                    toggle: true
                };
            });
        });
        bot.guilds.map(g => {
            g.data = {};
            g.data.prefix = config.prefix;
        });
        database.all("SELECT * FROM prefixes", (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            response.map(v => {
                if (bot.guilds.get(v.serverID)) bot.guilds.get(v.serverID).data = {
                    prefix: v.prefix
                };
            });
        });
        if (bot.shard.id === 0) {
            const app = express();
            app.use(bodyParser.json());
            app.get("/stats", (req, res) => {
                generateWebsiteStats(bot, database).then(r => res.send(r)).catch(error => {
                    console.error(error);
                    res.send({
                        error
                    });
                });
            });
            app.get("/commands", (req, res) => {
                let commands = Object.keys(bot.commands).filter(c => !bot.commands[c].hidden);
                let categorized = {};
                commands.map(c => {
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