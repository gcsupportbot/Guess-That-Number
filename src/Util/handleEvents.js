const handleDatabaseError = require('./handleDatabaseError');

module.exports = (bot, r) => {
	r.table('events').run((error, events) => {
		if (error) return handleDatabaseError(error);
		for (let i = 0; i < events.length; i++) {
			bot.events.set(events[i].id, true);
		}
	});
};