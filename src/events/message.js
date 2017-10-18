const handleMessage = require("../functions/handle-message.js");

module.exports = (bot, r) => {
	bot.on("message", (msg) => handleMessage(bot, r, msg));
};