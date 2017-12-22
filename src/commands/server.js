const config = require("../config.json");

module.exports = {
	commands: [
		"server",
		"support",
		"feedback"
	],
	description: "Join the official support server.",
	usage: "server",
	category: "Utility",
	hidden: false,
	execute: (bot, r, msg) => {
		msg.channel.createMessage(":tada: │ Come hang out with us in the official support server, or just suggest something for the bot. " + config.links.server);
	}
};