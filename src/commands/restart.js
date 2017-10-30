const config = require("../config.json");

module.exports = {
	commands: [
		"restart",
		"reboot"
	],
	usage: "restart",
	description: "Restarts the bot.",
	category: "Developers",
	hidden: true,
	execute: (bot, r, msg, args) => {
		if (config.trusted.indexOf(msg.author.id) > -1) {
			msg.channel.createMessage({
				embed: {
					title: "Restarting...",
					color: 3066993,
					description: "Automatically restarting the bot."
				}
			}).then(() => {
				process.exit();
			});
		} else {
			msg.channel.createMessage({
				embed: {
					title: "Error!",
					color: 0xE50000,
					description: "You do not have permission to execute this command."
				}
			});
		}
	}
};