module.exports = {
    interval: 15000,
    execute: (bot, database) => {
        database.all("SELECT 1", (error) => {
            if (error) console.error(error);
        });
    }
};