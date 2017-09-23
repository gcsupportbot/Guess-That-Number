const humanizeduration = require("humanize-duration");

module.exports = {
	commands: [
		"uptime"
	],
	usage: "uptime",
	description: "See how long the bot has been running.",
	category: "Information",
	hidden: false,
	execute: (bot, r, msg) => {
		msg.channel.send({
			embed: {
				title: "Uptime",
				color: 3066993,
				description: humanizeduration(Date.now() - bot.startuptime, {
					round: true
				})
			}
		});
	}
};