module.exports = (bot, query, returnIDOnly = false, preventUsernameSearch = false) => {
	return new Promise((resolve, reject) => {
		if (/^[\w\W]{2,32}#[0-9]{4}$/.test(query) && !preventUsernameSearch) {
			const username = query.match(/^[^#]+/)[0];
			const discrim = query.match(/[0-9]{4}$/)[0];
			const users = bot.users.filter((u) => u.username.toLowerCase() === username.toLowerCase() && u.discriminator === discrim);
			if (users.length > 0 && !returnIDOnly) return resolve(users[0]);
			if (returnIDOnly) return resolve(users[0].id);
		} else if (/^[0-9]{14,22}$/.test(query)) {
			if (returnIDOnly) return resolve(query);
			const user = bot.users.get(query);
			if (user) return resolve(user);
		} else if (/^<@!?[0-9]{14,22}>$/.test(query)) {
			if (returnIDOnly) return resolve(query.match(/[0-9]{14,22}/)[0]);
			const user = bot.users.get(query.match(/[0-9]{14,22}/)[0]);
			if (user) return resolve(user);
		} else if (!preventUsernameSearch) {
			const users = bot.users.filter((u) => u.username.toLowerCase().includes(query.toLowerCase()));
			if (users.length > 0 && !returnIDOnly) return resolve(users[0]);
			if (returnIDOnly) return resolve(users[0].id);
		}
		reject();
	});
};