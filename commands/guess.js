const handleDatabaseError = require("../functions/handle-database-error.js");
const updateUserStats = require("../functions/update-user-stats.js");
const humanizeduration = require("humanize-duration");
const config = require("../config.json");

module.exports = {
    commands: [
        "guess",
        "g"
    ],
    usage: "guess <number>",
    description: "Guess a number in your game.",
    category: "Game",
    hidden: false,
    execute: (bot, r, msg, args) => {
        r.table("games").filter({userID: msg.author.id}).run((error, response) => {
            if (error) return handleDatabaseError(error, msg);
            if (response.length > 0) {
                if (args.length > 0) {
                    const guess = Number(args[0].replace(/\,/g, ""));
                    if (isNaN(guess)) {
                        msg.channel.send({
                            embed: {
                                title: "Error!",
                                color: 0xE50000,
                                description: "The guessing number must be a valid number.",
                                footer: {
                                    text: "Requested by " + msg.author.tag
                                }
                            }
                        });
                    } else {
                        const max = ((response[0].difficulty === "1") ? 10000 : ((response[0].difficulty === "2") ? 100000 : ((response[0].difficulty === "3") ? 1000000 : 100000)));
                        if (guess >= 1 && guess <= max) {
                            r.table("games").filter({userID: msg.author.id}).update({
                                score: response[0].score + 1
                            }).run(error => {
                                if (error) return handleDatabaseError(error, msg);
                                if (guess > response[0].number) {
                                    msg.channel.send({
                                        embed: {
                                            title: "Lower!",
                                            color: 3066993,
                                            description: "The number is lower than `" + String(guess).replace(/(.)(?=(\d{3})+$)/g, '$1,') + "`.",
                                            footer: {
                                                text: "Requested by " + msg.author.tag
                                            }
                                        }
                                    });
                                } else if (guess < response[0].number) {
                                    msg.channel.send({
                                        embed: {
                                            title: "Higher!",
                                            color: 3066993,
                                            description: "The number is higher than `" + String(guess).replace(/(.)(?=(\d{3})+$)/g, '$1,') + "`.",
                                            footer: {
                                                text: "Requested by " + msg.author.tag
                                            }
                                        }
                                    });
                                } else if (guess === response[0].number) {
                                    r.table("games").filter({userID: msg.author.id}).delete().run(error => {
                                        if (error) return handleDatabaseError(error, msg);
                                        updateUserStats(r, msg, response, (error) => {
                                            if (error) return handleDatabaseError(error, msg);
                                            r.table("leaderboard").filter({userID: msg.author.id, difficulty: response[0].difficulty}).run((error, response2) => {
                                                if (error) return handleDatabaseError(error, msg);
                                                if (response2.length > 0) {
                                                    if ((response[0].score + 1) < response2[0].score) {
                                                        r.table("leaderboard").filter({userID: msg.author.id, difficulty: response[0].difficulty}).update({score: response[0].score + 1}).run(error => {
                                                            if (error) return handleDatabaseError(error, msg);
                                                            if (msg.author.data && msg.author.data.toggle) {
                                                                r.table("toggle").filter({userID: msg.author.id}).delete().run(error => {
                                                                    if (error) return handleDatabaseError(error, msg);
                                                                    msg.author.data.toggle = false;
                                                                    msg.channel.send({
                                                                        embed: {
                                                                            title: "You guessed the correct number!",
                                                                            color: 306993,
                                                                            description: "The number was `" + response[0].number + "`.\n\nYou guessed `" + (response[0].score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response[0].start_time, {
                                                                                round: true
                                                                            }) + "`.",
                                                                            footer: {
                                                                                text: "Requested by " + msg.author.tag
                                                                            }
                                                                        }
                                                                    });
                                                                });
                                                            } else {
                                                                msg.channel.send({
                                                                    embed: {
                                                                        title: "You guessed the correct number!",
                                                                        color: 3066993,
                                                                        description: "The number was `" + response[0].number + "`.\n\nYou guessed `" + (response[0].score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response[0].start_time, {
                                                                            round: true
                                                                        }) + "`.",
                                                                        footer: {
                                                                            text: "Requested by " + msg.author.tag
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        r.table("leaderboard").filter({userID: msg.author.id, difficulty: response[0].difficulty}).update({score: response[0].score + 1}).run(error => {
                                                            if (error) return handleDatabaseError(error, msg);
                                                            if (msg.author.data && msg.author.data.toggle) {
                                                                r.table("toggle").filter({userID: msg.author.id}).delete().run(error => {
                                                                    if (error) return handleDatabaseError(error, msg);
                                                                    msg.author.data.toggle = false;
                                                                    msg.channel.send({
                                                                        embed: {
                                                                            title: "You guessed the correct number!",
                                                                            color: 3066993,
                                                                            description: "The number was `" + response[0].number + "`.\n\nYou guessed `" + (response[0].score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response[0].start_time, {
                                                                                round: true
                                                                            }) + "`.",
                                                                            footer: {
                                                                                text: "Requested by " + msg.author.tag
                                                                            }
                                                                        }
                                                                    });
                                                                });
                                                            } else {
                                                                msg.channel.send({
                                                                    embed: {
                                                                        title: "You guessed the correct number!",
                                                                        color: 3066993,
                                                                        description: "The number was `" + response[0].number + "`.\n\nYou guessed `" + (response[0].score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response[0].start_time, {
                                                                            round: true
                                                                        }) + "`.",
                                                                        footer: {
                                                                            text: "Requested by " + msg.author.tag
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                } else {
                                                    r.table("leaderboard").insert({
                                                        userID: msg.author.id,
                                                        score: response[0].score + 1,
                                                        difficulty: response[0].difficulty
                                                    }).run(error => {
                                                        if (error) return handleDatabaseError(error, msg);
                                                        if (msg.author.data && msg.author.data.toggle) {
                                                            r.table("toggle").filter({userID: msg.author.id}).run(error => {
                                                                if (error) return handleDatabaseError(error, msg);
                                                                msg.author.data.prefix = false;
                                                                msg.channel.send({
                                                                    embed: {
                                                                        title: "You guessed the correct number!",
                                                                        color: 306993,
                                                                        description: "The number was `" + response[0].number + "`.\n\nYou guessed `" + (response[0].score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response[0].start_time, {
                                                                            round: true
                                                                        }) + "`.",
                                                                        footer: {
                                                                            text: "Requested by " + msg.author.tag
                                                                        }
                                                                    }
                                                                });
                                                            });
                                                        } else {
                                                            msg.channel.send({
                                                                embed: {
                                                                    title: "You guessed the correct number!",
                                                                    color: 3066993,
                                                                    description: "The number was `" + response[0].number + "`.\n\nYou guessed `" + (response[0].score + 1) + "` times before ending the game.\n\nThe game was active for `" + humanizeduration(Date.now() - response[0].start_time, {
                                                                        round: true
                                                                    }) + "`.",
                                                                    footer: {
                                                                        text: "Requested by " + msg.author.tag
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    });
                                }
                            });
                        } else {
                            msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "The guessing amount cannot be above `" + String(max).replace(/(.)(?=(\d{3})+$)/g, '$1,') + "` or below `1`.",
                                    footer: {
                                        text: "Requested by " + msg.author.tag
                                    }
                                }
                            });
                        }
                    }
                } else {
                    msg.channel.send({
                        embed: {
                            title: "Error!",
                            color: 0xE50000,
                            description: "Missing `<number>` option.",
                            footer: {
                                text: "Requested by " + msg.author.tag
                            }
                        }
                    });
                }
            } else {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "You're not in a game. To start one, use `" + ((msg.guild) ? msg.guild.data.prefix : config.prefix) + "start`.",
                        footer: {
                            text: "Requested by " + msg.author.tag
                        }
                    }
                });
            }
        });
    }
};