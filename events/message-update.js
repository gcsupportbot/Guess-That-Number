const handleMessage = require("../functions/handle-message.js");

module.exports = (bot, database) => {
    bot.on("messageUpdate", (oldmsg, newmsg) => handleMessage(bot, database, newmsg));
};