const handleDatabaseError = require("../functions/handle-database-error.js");
const config = require("../config.json");

module.exports = {
    commands: [
        "toggle",
        "tog"
    ],
    usage: "toggle",
    description: "Send guess as single message.",
    category: "Game",
    hidden: false,
    execute: (bot, database, msg, args) => {
        database.all("SELECT * FROM games WHERE userID = ?", [msg.author.id], (error, response) => {
            if (error) return handleDatabaseError(bot, error, msg);
            if (response.length > 0) {
                database.all("SELECT * FROM toggle WHERE userID = ?", [msg.author.id], (error, response) => {
                    if (error) return handleDatabaseError(bot, error, msg);
                    if (response.length > 0) {
                        database.run("DELETE FROM toggle WHERE userID = ?", [msg.author.id], (error) => {
                            if (error) return handleDatabaseError(bot, error, msg);
                            if (msg.author.data) msg.author.data.toggle = false;
                            msg.channel.send({
                                embed: {
                                    title: "Toggled!",
                                    color: 3066993,
                                    description: "Turned off toggle mode."
                                }
                            });
                        });
                    } else {
                        database.run("INSERT INTO toggle (userID) VALUES (?)", [msg.author.id], (error) => {
                            if (error) return handleDatabaseError(bot, error, msg);
                            if (!msg.author.data) msg.author.data = {};
                            msg.author.data.toggle = true;
                            msg.channel.send({
                                embed: {
                                    title: "Toggled!",
                                    color: 3066993,
                                    description: "All your messages that are numbers will be counted as a guess from now on."
                                }
                            });
                        });
                    }
                });
            } else {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "You must be in a game to use this command. Start a game using `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "start`."
                    }
                });
            }
        });
    }
};