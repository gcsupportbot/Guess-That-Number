module.exports = (bot) => {
    bot.on("disconnect", (event) => {
        process.exit();
    });
};