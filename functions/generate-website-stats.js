const humanizeduration = require("humanize-duration");

module.exports = (bot) => {
	return new Promise((resolve, reject) => {
		bot.shard.fetchClientValues("guilds.size").then((guilds) => {
			bot.shard.fetchClientValues("users.size").then((users) => {
				bot.shard.fetchClientValues("channels.size").then((channels) => {
					resolve({
						servers: guilds.reduce((a, b) => a + b, 0),
						users: users.reduce((a, b) => a + b, 0),
						channels: channels.reduce((a, b) => a + b, 0),
						uptime: humanizeduration(Date.now() - bot.startuptime, {
							round: true
						}),
						commands: Object.keys(bot.commands).length
					});
				}).catch((error) => {
					reject(error);
				});
			}).catch((error) => {
				reject(error);
			});
		}).catch((error) => {
			reject(error);
		});
	});
};