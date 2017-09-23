module.exports = {
	commands: [
		"ping"
	],
	usage: "ping",
	description: "See how long it takes to ping the bot.",
	category: "General",
	hidden: false,
	execute: (bot, r, msg) => {
		const start = Date.now();
		msg.channel.send({
			embed: {
				title: "Pinging...",
				color: 3066993
			}
		}).then((newmsg) => {
			const end = Date.now();
			newmsg.edit({
				embed: {
					title: "Pong!",
					description: "It took `" + (end - start) + "ms` to send this message.",
					color: 3066993
				}
			});
		});
	}
};