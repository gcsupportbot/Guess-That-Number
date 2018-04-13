const logger = require('./logger.js');

module.exports = (error, msg) => {
	if (msg) msg.channel.createMessage(':exclamation: │ An error occured while running that command. This incident has been reported and will be resolved shortly.');
	logger.error('Failed to query database.', error);
};