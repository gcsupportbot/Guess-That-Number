const handleMessage = require("../functions/handle-message.js");

module.exports = (bot, r) => {
	bot.on("messageUpdate", (oldmsg, newmsg) => handleMessage(bot, r, newmsg));
};