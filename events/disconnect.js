module.exports = (bot) => {
	bot.on("disconnect", () => {
		process.exit();
	});
};