class Command {
	constructor(args) {
		this.command = args.command;
		this.aliases = args.aliases;
		this.description = args.description;
		this.usage = args.usage;
		this.execute = args.execute;
	}
}

module.exports = Command;