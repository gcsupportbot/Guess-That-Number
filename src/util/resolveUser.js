module.exports = (bot, query) => {
	return new Promise((resolve, reject) => {
		if (/(?:<@|<@!)\d+(?:>)/.test(query)) {
			const user = bot.users.get(query.match(/\d+/)[0]);
			if (user) {
				resolve(user);
			}
		} else {
			if (/.{2,32}#\d{4}/.test(args.join(' '))) {
				const match = args.join(' ').split('#');
				const users = bot.users.filter((u) => u.username.toLowerCase() === match[0].toLowerCase() && u.discriminator === match[1]);
				if (users.length > 0) {
					resolve(users[0]);
				}
			} else {
				const users = bot.users.filter((u) => u.username.toLowerCase() === query.join(' ').toLowerCase());
				if (users.length > 0) {
					resolve(users[0]);
				}
			}
		}
		reject();
	});
};