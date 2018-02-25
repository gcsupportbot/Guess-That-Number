const handleMessage = require('../util/handleMessage.js');

module.exports = (bot, r) => {
	bot.on('messageUpdate', (oldmsg, newmsg) => handleMessage(bot, r, newmsg));
};