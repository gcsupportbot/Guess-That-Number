const handleMessage = require('../util/handleMessage.js');

module.exports = (bot, r) => {
	bot.on('messageUpdate', (msg) => handleMessage(bot, r, msg));
};