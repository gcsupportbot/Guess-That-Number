module.exports = (r, msg, response, callback) => {
	r.table("user_statistics").get(msg.author.id).run((error, response2) => {
		if (error) return callback(error);
		const coinsAwarded = (response.difficulty === 1) ? 50 : (response.difficulty === 2) ? 100 : (response.difficulty === 3) ? 150 : 100;
		if (response2) {
			r.table("user_statistics").get(msg.author.id).update({
				easy_games_played: ((response.difficulty === 1) ? response2.easy_games_played + 1 : response2.easy_games_played),
				medium_games_played: ((response.difficulty === 2) ? response2.medium_games_played + 1 : response2.medium_games_played),
				hard_games_played: ((response.difficulty === 3) ? response2.hard_games_played + 1 : response2.hard_games_played),
				easy_guesses: ((response.difficulty === 1) ? response2.easy_guesses + response.score : response2.easy_guesses),
				medium_guesses: ((response.difficulty === 2) ? response2.medium_guesses + response.score : response2.medium_guesses),
				hard_guesses: ((response.difficulty === 3) ? response2.hard_guesses + response.score : response2.hard_guesses),
				easy_game_time: ((response.difficulty === 1) ? Number(response2.easy_game_time) + (Date.now() - Number(response.start_time)) : response2.easy_game_time),
				medium_game_time: ((response.difficulty === 2) ? Number(response2.medium_game_time) + (Date.now() - Number(response.start_time)) : response2.medium_game_time),
				hard_game_time: ((response.difficulty === 3) ? Number(response2.hard_game_time) + (Date.now() - Number(response.start_time)) : response2.hard_game_time),
				coins: r.row("coins").add(coinsAwarded).default(0)
			}).run((error) => {
				if (error) return callback(error, null);
				callback(false, coinsAwarded);
			});
		} else {
			r.table("user_statistics").insert({
				id: msg.author.id,
				easy_games_played: ((response.difficulty === 1) ? 1 : 0),
				medium_games_played: ((response.difficulty === 2) ? 1 : 0),
				hard_games_played: ((response.difficulty === 3) ? 1 : 0),
				easy_guesses: ((response.difficulty === 1) ? response.score : 0),
				medium_guesses: ((response.difficulty === 2) ? response.score : 0),
				hard_guesses: ((response.difficulty === 3) ? response.score : 0),
				easy_game_time: ((response.difficulty === 1) ? (Date.now() - Number(response.start_time)) : 0),
				medium_game_time: ((response.difficulty === 2) ? (Date.now() - Number(response.start_time)) : 0),
				hard_game_time: ((response.difficulty === 3) ? (Date.now() - Number(response.start_time)) : 0),
				coins: coinsAwarded
			}).run((error) => {
				if (error) return callback(error, null);
				callback(false, coinsAwarded);
			});
		}
	});
};