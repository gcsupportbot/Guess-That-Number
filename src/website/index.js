const express = require("express");
const passport = require("passport");
const passportDiscord = require("passport-discord");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const humanizeduration = require("humanize-duration");
const config = require("../config.json");
const log = require("../managers/logger.js");

module.exports = (bot, r) => {
	passport.use(new passportDiscord.Strategy({
		clientID: bot.user.id,
		clientSecret: config.secret,
		scope: [ "identify" ],
		callbackURL: "/auth/callback"
	}, (accessToken, refreshToken, profile, done) => {
		if (accessToken !== null) {
			r.table("users").insert(profile, { conflict: "replace" }).run((error) => {
				console.log(error);
				if (error) return done(error, null);
				done(null, profile);
			});
		}
	}));

	passport.serializeUser((user, done) => done(null, user.id));

	passport.deserializeUser((id, done) => {
		r.table("users").get(id).run(r.conn).then((user) => {
			done(null, user);
		});
	});

	const app = express();

	app.use(cookieSession({
		name: "session",
		secret: config.secret,
		expires: false
	}));
	app.use(cookieParser(config.secret));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.set("view engine", "pug");
	app.set("views", __dirname + "/dynamic");

	app.get("/", (req, res) => {
		res.render("index.pug", {
			user: req.user
		});
	});
	
	app.get("/dashboard", (req, res) => {
		if (!req.user) return res.redirect("/auth");
		bot.shard.broadcastEval("this.guilds.filter(g => g.members.get('" + req.user.id + "') && g.members.get('" + req.user.id + "').hasPermission('MANAGE_GUILD')).map(g => ({name: g.name, icon: g.icon, id: g.id}))").then(guilds => {
			guilds = [].concat.apply([], guilds);
			res.render("dashboard/index.pug", {
				user: req.user,
				servers: guilds
			});
		}).catch(() => {
			res.render("error.pug", {
				user: req.user,
				code: 500,
				message: "An unknown error occured."
			});
		});
	});
	
	app.get("/dashboard/:id", (req, res) => {
		if (!req.user) res.redirect("/auth");
		if (!/^\d+$/.test(req.params.id)) return res.render("error.pug", {
			user: req.user,
			code: 400,
			message: "That is not a valid Discord server ID."
		});
		bot.shard.broadcastEval("this.guilds.get('" + req.params.id + "') && this.guilds.get('" + req.params.id + "').members.get('" + req.user.id + "') && this.guilds.get('" + req.params.id + "').members.get('" + req.user.id + "').hasPermission('MANAGE_GUILD') && { name: this.guilds.get('" + req.params.id + "').name, memberCount: this.guilds.get('" + req.params.id + "').memberCount, channelCount: this.guilds.get('" + req.params.id + "').channels.size, roleCount: this.guilds.get('" + req.params.id + "').roles.size, avatar: this.guilds.get('" + req.params.id + "').avatar }").then(guilds => {
			guilds = guilds.filter(v => v)[0];
			if (guilds) {
				res.render("dashboard/manage.pug", {
					user: req.user,
					server: guilds
				});
			} else {
				res.render("error.pug", {
					user: req.user,
					code: "404",
					message: "Either that server doesn't exist or you don't have permission to manage it."
				});
			}
		}).catch(() => {
			res.render("error.pug", {
				user: req.user,
				code: 500,
				message: "An unknown error occured."
			});
		});
	});
	
	app.get("/statistics", (req, res) => {
		bot.shard.broadcastEval("[this.guilds.size, this.users.size, this.channels.size]").then((stats) => {
			const statistics = {
				servers: 0,
				users: 0,
				channels: 0,
				uptime: humanizeduration(Date.now() - bot.startuptime, {round: true}),
				commands: Object.keys(bot.commands).length
			};
			for (var i = 0; i < stats.length; i++) {
				statistics.servers += stats[i][0];
				statistics.users += stats[i][1];
				statistics.channels += stats[i][2];
			}
			res.render("statistics.pug", {
				user: req.user,
				stats: statistics
			});
		}).catch(() => {
			res.render("error.pug", {
				user: req.user,
				code: 500,
				message: "An unknown error occured."
			});
		});
	});
	
	app.get("/commands", (req, res) => {
		let sorted = [];
		Object.keys(bot.commands).forEach(v => {
			if (sorted.filter(s => s.category === bot.commands[v].category).length < 1) sorted.push({ category: bot.commands[v].category, commands: [] });
			sorted[sorted.indexOf(sorted.filter(s => s.category === bot.commands[v].category)[0])].commands.push(bot.commands[v]);
		});
		res.render("commands.pug", {
			user: req.user,
			commands: sorted
		});
	});
	
	app.get("/invite", (req, res) => {
		res.redirect("https://discordapp.com/oauth2/authorize?client_id=307994108792799244&scope=bot");
	});
	
	app.get("/auth", passport.authenticate("discord"));

	app.get("/auth/callback", passport.authenticate("discord"), (req, res) => {
		res.redirect("/dashboard");
	});

	app.get("/auth/logout", (req, res) => {
		req.logout();
		res.redirect("/");
	});

	app.use("/assets", express.static(__dirname + "/static"));

	app.use("*", (req, res) => {
		res.status(404).render("error.pug", {
			user: req.user,
			code: 404,
			message: "The requested page or resource was not found."
		});
	});

	app.listen(config.website_port, (error) => {
		if (error) throw error;
		log("Website listening on port " + config.website_port + ".");
	});
};