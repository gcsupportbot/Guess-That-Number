const handleDatabaseError = require("../functions/handle-database-error.js");
const config = require("../config.json");

module.exports = {
	commands: [
		"profile"
	],
	usage: "profile [@user | userID | username]",
	description: "View the profile of yourself or another user.",
	category: "General",
	hidden: false,
	execute: (bot, r, msg, args) => {
		r.table("user_statistics").get(msg.author.id).run((error, user) => {
			if (error) return handleDatabaseError(error, msg);
			msg.channel.createMessage({
				embed: {
					title: "Your Profile",
					thumbnail: {
						url: msg.author.avatarURL
					},
					description: "You can purchase things to display on your profile within the `" + ((msg.channel.guild) ? bot.prefixes[msg.channel.guild.id] : config.prefix) + "shop`.",
					fields: [
						{
							name: "Coins",
							value: user ? user.coins : 0,
							inline: true
						},
						{
							name: "Total Coins",
							value: user ? user.totalCoins : 0,
							inline: true
						},
						{
							name: "More things...",
							value: "coming soon! :eyes:",
							inline: true
						}
					]
				}
			});
		});
	}
};