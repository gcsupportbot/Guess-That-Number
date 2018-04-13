const Collection = require('./Collection.js');

class Module {
	constructor(args, fileName) {
		this.name = args.name;
		this.description = args.description;
		this.visible = args.visible;
		this.fileName = fileName;
		this.commands = new Collection();
		for (let i = 0; i < args.commands.length; i++) {
			this.commands.set(args.commands[i].command, args.commands[i]);
		}
	}

	get commandCount() {
		return this.commands.size;
	}

	hasCommand(name) {
		return this.commands.filter((c) => c.command === name.toLowerCase() || c.aliases.includes(name.toLowerCase())).length > 0;
	}

	getCommand(name) {
		return this.commands.filter((c) => c.command === name.toLowerCase() || c.aliases.includes(name.toLowerCase()))[0];
	}
}

module.exports = Module;