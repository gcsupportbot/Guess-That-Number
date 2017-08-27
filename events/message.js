const handleMessage = require("../functions/handle-message.js");

module.exports = (bot, database) => {
    bot.on("message", (msg) => handleMessage(bot, database, msg));
};