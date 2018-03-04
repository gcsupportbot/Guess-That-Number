const handleDatabaseError = require('./handleDatabaseError.js');

module.exports = (bot, r) => {
	r.table('intervals').get('raffle').run((error, response) => {
		if (error) return handleDatabaseError(error);
		setTimeout(() => {
			r.table('intervals').get('raffle').update({
				end_time: response.end_time + (1000 * 60 * 60 * 24 * 7),
				participants: []
			}).run((error) => {
				if (error) return handleDatabaseError(error);
				if (response.participants.length < 1) return;
				const winner = response.participants[Math.floor(Math.random() * response.participants.length)];
				const potSize = response.participants.map((p) => p.bet).reduce((a, b) => a + b, 0);
				const user = bot.users.get(winner.user.id);
				r.table('user_statistics').get(winner.user.id).update({
					coins: r.row('coins').default(0).add(potSize)
				}).run((error) => {
					if (error) return handleDatabaseError(error);
					if (user) user.getDMChannel().then((dm) => {
						dm.createMessage(':tada: │ Congratulations! You\'ve won the raffle that you entered a while back. You have been given ' + potSize + ' coins to use within the shop. Good luck, and thank you for playing!');
					});
				});
			});
		}, response.end_time - Date.now());
	});
};