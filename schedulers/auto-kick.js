const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = {
    interval: 30000,
    execute: (bot, database) => {
        database.all("SELECT * FROM games", (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (response.length !== 0) {
                response.forEach((index, value) => {
                    if (Date.now() - index.start_time >= (1000 * 60 * 60 * 24)) {
                        if (bot.users.get(index.userID)) bot.users.get(index.userID).send("As of 12 hours ago, you started a " + ((index.difficulty === 1) ? "easy" : ((index.difficulty === 2) ? "medium" : ((index.difficulty === 3) ? "hard" : "unknown"))) + " difficulty game. To keep from getting too many active games, we have kicked you from it. If you would like to start another game, you may do so by running the `start` command again. Thank you.");
                        database.run("DELETE FROM games WHERE userID = ?", [index.userID], (error) => {
                            if (error) return handleDatabaseError(bot, error);
                            if (bot.users.get(index.userID) && bot.users.get(index.userID).data && bot.users.get(index.userID).data.toggle) {
                                database.run("DELETE FROM toggle WHERE userID = ?", [index.userID], (error) => {
                                    if (error) return handleDatabaseError(bot, error);
                                    bot.users.get(index.userID).data.toggle = false;
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};