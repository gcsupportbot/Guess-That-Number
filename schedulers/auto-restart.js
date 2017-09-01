const log = require("../managers/logger.js");

module.exports = {
    interval: (1000 * 60 * 60 * 24),
    execute: async (bot, r) => {
        await log("Bot has been online for 24 hours, restarting...");
        process.exit();
    }
};