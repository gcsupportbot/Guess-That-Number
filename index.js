const Discord = require("discord.js");
const fs = require("fs");
const sqlite = require("sqlite3");
const config = require("./config.json");
const log = require("./managers/logger.js");

const bot = new Discord.Client({
    disabledEvents: [
        "TYPING_START",
        "TYPING_STOP",
        "PRESENCE_UPDATE"
    ],
    disableEveryone: true,
    messageCacheMaxSize: 100
});

const database = new sqlite.Database("./database.db");

let start = Date.now();

fs.readdir("./commands/", (error, files) => {
    if (error) throw new error();
    bot.commands = [];
    files.map(file => {
        bot.commands[file.replace(/\..*/, "")] = require("./commands/" + file);
        if (files.indexOf(file) === files.length - 1) {
            log("Loaded " + files.length + " commands! (" + (Date.now() - start) + " ms)");
            fs.readdir("./events", (error, files) => {
                if (error) throw new error();
                files.map(file => {
                    require("./events/" + file)(bot, database);
                    if (files.indexOf(file) === files.length - 1) {
                        log("Loaded " + files.length + " events! (" + (Date.now() - start) + " ms)");
                        start = Date.now();
                        fs.readdir("./schedulers", (error, files) => {
                            if (error) throw new error();
                            files.map(index => {
                                setInterval(require("./schedulers/" + index).execute, require("./schedulers/" + index).interval, bot, database);
                                if (files.indexOf(index) === files.length - 1) {
                                    log("Loaded " + files.length + " schedules! (" + (Date.now() - start) + " ms)");
                                    bot.login(config.token);
                                }
                            });
                        });
                    }
                });
            });
        }
    });
});