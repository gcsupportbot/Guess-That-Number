const handleMessage = require('../util/handleMessage.js');

module.exports = (bot, r) => {
	bot.on('messageCreate', (msg) => handleMessage(bot, r, msg));
};