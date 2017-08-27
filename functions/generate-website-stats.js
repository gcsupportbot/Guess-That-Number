const handleDatabaseError = require("./handle-database-error.js");
const humanizeduration = require("humanize-duration");

module.exports = (bot, database) => {
    return new Promise((resolve, reject) => {
        database.all("SELECT count(*) AS activegames FROM games", (error, activegames) => {
            if (error) {
                handleDatabaseError(bot, error);
                reject(error);
            } else {
                bot.shard.fetchClientValues("guilds.size").then(guilds => {
                    bot.shard.fetchClientValues("users.size").then(users => {
                        bot.shard.fetchClientValues("channels.size").then(channels => {
                            bot.shard.broadcastEval("this.channels.filter(c => c.type === 'text').size").then(text_channels => {
                                bot.shard.broadcastEval("this.channels.filter(c => c.type === 'voice').size").then(voice_channels => {
                                    bot.shard.broadcastEval("this.guilds.map(g => g.roles.size).reduce((a, b) => a + b, 0)").then(roles => {
                                        bot.shard.broadcastEval("process.memoryUsage().heapUsed").then(memory => {
                                            resolve({
                                                servers: guilds.reduce((a, b) => a + b, 0),
                                                users: users.reduce((a, b) => a + b, 0),
                                                channels: channels.reduce((a, b) => a + b, 0),
                                                text_channels: text_channels.reduce((a, b) => a + b, 0),
                                                voice_channels: voice_channels.reduce((a, b) => a + b, 0),
                                                roles: roles.reduce((a, b) => a + b, 0),
                                                uptime: humanizeduration(Date.now() - bot.startuptime, {
                                                    round: true
                                                }),
                                                commands: Object.keys(bot.commands).length,
                                                active_games: activegames[0].activegames
                                            });
                                        }).catch(error => {
                                            reject(error);
                                        });
                                    }).catch(error => {
                                        reject(error);
                                    });
                                }).catch(error => {
                                    reject(error);
                                });
                            }).catch(error => {
                                reject(error);
                            });
                        }).catch(error => {
                            reject(error);
                        });
                    }).catch(error => {
                        reject(error);
                    });
                }).catch(error => {
                    reject(error);
                });
            }
        });
    });
};