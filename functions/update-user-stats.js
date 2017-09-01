module.exports = (r, msg, response, callback) => {
    r.table("user_statistics").filter({userID: msg.author.id}).run((error, response2) => {
        if (error) return callback(error);
        if (response2.length > 0) {
            r.table("user_statistics").filter({userID: msg.author.id}).update({
                easy_games_played: ((response[0].difficulty === "1") ? response2[0].easy_games_played + 1 : response2[0].easy_games_played),
                medium_games_played: ((response[0].difficulty === "2") ? response2[0].medium_games_played + 1 : response2[0].medium_games_played),
                hard_games_played: ((response[0].difficulty === "3") ? response2[0].hard_games_played + 1 : response2[0].hard_games_played),
                easy_guesses: ((response[0].difficulty === "1") ? response2[0].easy_guesses + response[0].score : response2[0].easy_guesses),
                medium_guesses: ((response[0].difficulty === "2") ? response2[0].medium_guesses + response[0].score : response2[0].medium_guesses),
                hard_guesses: ((response[0].difficulty === "3") ? response2[0].hard_guesses + response[0].score : response2[0].hard_guesses),
                easy_game_time: ((response[0].difficulty === "1") ? Number(response2[0].easy_game_time) + (Date.now() - Number(response[0].start_time)) : response2[0].easy_game_time),
                medium_game_time: ((response[0].difficulty === "2") ? Number(response2[0].medium_game_time) + (Date.now() - Number(response[0].start_time)) : response2[0].medium_game_time),
                hard_game_time: ((response[0].difficulty === "3") ? Number(response2[0].hard_game_time) + (Date.now() - Number(response[0].start_time)) : response2[0].hard_game_time),
            }).run((error) => {
                if (error) return callback(error);
                callback(false);
            });
        } else {
            r.table("user_statistics").insert({
                userID: msg.author.id,
                easy_games_played: ((response[0].difficulty === "1") ? 1 : 0),
                medium_games_played: ((response[0].difficulty === "2") ? 1 : 0),
                hard_games_played: ((response[0].difficulty === "3") ? 1 : 0),
                easy_guesses: ((response[0].difficulty === "1") ? response[0].score : 0),
                medium_guesses: ((response[0].difficulty === "2") ? response[0].score : 0),
                hard_guesses: ((response[0].difficulty === "3") ? response[0].score : 0),
                easy_game_time: ((response[0].difficulty === "1") ? (Date.now() - Number(response[0].start_time)) : 0),
                medium_game_time: ((response[0].difficulty === "2") ? (Date.now() - Number(response[0].start_time)) : 0),
                hard_game_time: ((response[0].difficulty === "3") ? (Date.now() - Number(response[0].start_time)) : 0)
            }).run((error) => {
                if (error) return callback(error);
                callback(false);
            });
        }
    });
};