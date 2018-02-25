const handleMessage = require('../util/handleMessage.js');

module.exports = (bot, r) => {
	bot.on('messageUpdate', (msg, oldMsg) => oldMsg !== null && handleMessage(bot, r, msg));
};