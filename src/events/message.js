const handleMessage = require("../functions/handle-message.js");

module.exports = (bot, r) => {
	bot.on("messageCreate", (msg) => handleMessage(bot, r, msg));
};