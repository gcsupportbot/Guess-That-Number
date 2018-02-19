const config = require('../config.json');

module.exports = (bot, ...message) => {
	bot.guilds.get(bot.channelGuildMap[config.log_channel]).channels.get(config.log_channel).createMessage(...message);
};