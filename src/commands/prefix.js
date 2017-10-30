const handleDatabaseError = require("../functions/handle-database-error.js");
const config = require("../config.json");

module.exports = {
	commands: [
		"prefix"
	],
	usage: "prefix [new prefix]",
	description: "View the prefix for your server or change it to a new one.",
	category: "General",
	hidden: false,
	execute: (bot, r, msg, args) => {
		if (args.length > 0) {
			if (msg.channel.type === "dm") return msg.channel.createMessage({
				embed: {
					title: "Error!",
					description: "You cannot change the prefix in a Direct Message.",
					color: 0xE50000
				}
			});
			if (msg.member.permission.has("manageChannels") || msg.author.id === msg.channel.guild.ownerID || config.trusted.indexOf(msg.author.id) > -1) {
				if (args.join(" ").length > 10) {
					msg.channel.createMessage({
						embed: {
							title: "Error!",
							description: "The prefix cannot be longer than 10 characters.",
							color: 0xE50000
						}
					});
				} else {
					r.table("prefixes").get(msg.channel.guild.id).run((error, count) => {
						if (error) return handleDatabaseError(error, msg);
						if (count) {
							r.table("prefixes").get(msg.channel.guild.id).update({ prefix: args.join(" ") }).run((error) => {
								if (error) return handleDatabaseError(error, msg);
								msg.channel.guild.data.prefix = args.join(" ");
								msg.channel.createMessage({
									embed: {
										title: "Updated!",
										description: "Set this server's prefix to `" + args.join(" ") + "`.",
										color: 3066993
									}
								});
							});
						} else {
							r.table("prefixes").insert({
								id: msg.channel.guild.id,
								prefix: args.join(" ")
							}).run((error) => {
								if (error) return handleDatabaseError(error, msg);
								msg.channel.guild.data.prefix = args.join(" ");
								msg.channel.createMessage({
									embed: {
										title: "Updated!",
										color: 3066993,
										description: "Set this server's prefix to `" + args.join(" ") + "`."
									}
								});
							});
						}
					});
				}
			} else {
				msg.channel.createMessage({
					embed: {
						title: "Error!",
						color: 0xE50000,
						description: "You do not have permission to change this server's prefix. You need to have `Manage Channels` permission."
					}
				});
			}
		} else {
			msg.channel.createMessage({
				embed: {
					title: "Prefix",
					color: 3066993,
					description: "The prefix for this server is `" + ((msg.channel.guild) ? msg.channel.guild.data.prefix : config.prefix) + "` or `@" + bot.user.username + "#" + bot.user.discriminator + "`."
				}
			});
		}
	}
};