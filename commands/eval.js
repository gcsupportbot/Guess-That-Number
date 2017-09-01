const config = require("../config.json");
const snekfetch = require("snekfetch");
const util = require("util");
const fs = require("fs");
let _ = null;
const removeSensitiveInformation = require("../functions/remove-sensitive-information.js");

module.exports = {
    commands: [
        "eval"
    ],
    usage: "eval <code>",
    description: "Evalute code inside the bot.",
    category: "Developers",
    hidden: true,
    execute: async (bot, r, msg, args) => {
        if (config.trusted.indexOf(msg.author.id) > -1) {
            if (args.length > 0) {
                try {
                    let result = await eval(args.join(" "));
                    if (typeof (result) !== "string") result = util.inspect(result, {
                        depth: 3,
                        maxArrayLength: 2048
                    });
                    result = removeSensitiveInformation(result);
                    if (result.length > 1985) {
                        snekfetch.post("https://haste.passthemayo.space/documents").send(result).then((body) => {
                            msg.channel.send({
                                embed: {
                                    title: "Warning!",
                                    color: 0xFFA500,
                                    description: "Result was over 2,000 characters, Generated hastebin link instead. https://haste.passthemayo.space/" + body.body.key + ".js"
                                }
                            });
                        }).catch((error) => {
                            msg.channel.send({
                                embed: {
                                    title: "Error!",
                                    color: 0xE50000,
                                    description: "Failed to generate hastebin link. `" + error.message + "`"
                                }
                            });
                        });
                    } else {
                        msg.channel.send("```js\n" + result + "```");
                    }
                    _ = result;
                } catch (e) {
                    msg.channel.send("```js\n" + e + "```");
                }
            } else {
                msg.channel.send({
                    embed: {
                        title: "Error!",
                        color: 0xE50000,
                        description: "Missing `<code>` option."
                    }
                });
            }
        } else {
            msg.channel.send({
                embed: {
                    title: "Error!",
                    color: 0xE50000,
                    description: "You do not have permission to execute this command."
                }
            });
        }
    }
};