const handleDatabaseError = require("../functions/handle-database-error.js");

module.exports = {
    interval: 12e4,
    execute: (bot, database) => {
        database.all("SELECT * FROM reset", (error, response) => {
            if (error) return handleDatabaseError(bot, error);
            if (Date.now() - response[0].timestamp > (1000 * 60 * 60 * 24 * 15)) {
                database.all("SELECT count(*) AS count FROM leaderboard", (error, response) => {
                    if (error) return handleDatabaseError(bot, error);
                    database.run("DELETE FROM leaderboard", (error) => {
                        if (error) return handleDatabaseError(bot, error);
                        database.run("UPDATE reset SET timestamp = ?", [Date.now()], (error) => {
                            if (error) return handleDatabaseError(bot, error);
                        });
                    });
                });
            }
        });
    }
};