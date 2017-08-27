const config = require("../config.json");
const guess = require("../commands/guess.js");

module.exports = (bot, database, msg) => {
    if (msg.author.bot) return;
    if (msg.author.data && msg.author.data.toggle) {
        if (msg.content !== "" && !isNaN(parseInt(msg.content))) {
            let new_event = Object.create(msg);
            new_event.content = config.prefix + "guess " + Number(msg.content);
            guess.execute(bot, database, new_event, new_event.content.split(" ").slice(1));
            return;
        }
    }
    let prefix = ((msg.content.startsWith(((msg.guild) ? msg.guild.data.prefix : config.prefix))) ? ((msg.guild) ? msg.guild.data.prefix : config.prefix) : ((msg.content.startsWith("<@" + bot.user.id + ">")) ? "<@" + bot.user.id + "> " : ((msg.content.startsWith("<@!" + bot.user.id + ">")) ? "<@!" + bot.user.id + "> " : null)));
    if (!prefix) return;
    let command = Object.keys(bot.commands).filter(c => bot.commands[c].commands.indexOf(msg.content.replace(prefix, "").split(" ")[0]) > -1);
    if (command.length > 0) {
        const args = ((msg.content.replace(prefix, "").split(" ").length > 1) ? msg.content.replace(prefix, "").split(" ").slice(1) : []);
        try {
            bot.commands[command[0]].execute(bot, database, msg, args);
        } catch (error) {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "An error occured when attempting to execute command."
                }
            });
            console.error(error);
        }
    }
};