const handleMessage = require("../functions/handle-message.js");

module.exports = (bot, r) => {
	bot.on("messageUpdate", (msg) => handleMessage(bot, r, msg));
};