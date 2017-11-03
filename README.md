# Guess-That-Number
A unique and addicting game in which you have to guess the randomly generated number based on hints.

## Getting Started
It is recommended that you do not try to run this on your own. If you are experienced with Node.js applications and have used RethinkDB before, then go ahead. The `config.example.json` file under `src/` needs to be renamed to `config.json`. Then please fill out the information in the file. A RethinkDB database is required in order for the bot to function. Please make sure you have that installed, created a database, added added the following tables to it:
* balance
* command_stats
* games
* invervals
* leaderboard
* prefixes
* toggle
* user_statistics
* users
Once you have created all of those tables, please run the following command:
```js
r.table("intervals").insert({ id: "reset", timestamp: Date.now() + (1000 * 60 * 60 * 24 * 15) });
```
This will insert the correct information of when the leaderboard will automatically reset. Without running this code, the bot will error after every 2 minutes. This should go ahead and get you started. Happy coding!

## Feature Requests
If you want to request a feature, please don't open an issue here. We provide faster and better support via our [Discord support server](https://discord.gg/3hqURjk).

## Bugs
If you find a bug within this bot, please don't open an issue here. We provide faster and better support via our [Discord support server](https://discord.gg/3hqURjk).

## License
This bot is under the Apache 2.0 License which you can view [here](https://github.com/PassTheMayo/Guess-That-Number/blob/master/LICENSE).
