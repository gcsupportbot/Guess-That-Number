const express = require("express");
const http = require("http");
const passport = require("passport");
const socketio = require("socket.io");
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
		scope: ["identify"],
		callbackURL: "/guess-that-number/auth/callback"
	}, (accessToken, refreshToken, profile, done) => {
		if (accessToken !== null) {
			r.table("users").insert(profile, { conflict: "replace" }).run((error) => {
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

	app.use((req, res, next) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		next();
	});
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
		if (!req.user) return res.redirect("/guess-that-number/auth");
		res.render("dashboard/index.pug", {
			user: req.user,
			servers: bot.guilds.filter((g) => g.members.get(req.user.id) && g.members.get(req.user.id).permission.has("manageGuild")).map((g) => ({ name: g.name, icon: g.icon, id: g.id }))
		});
	});

	app.get("/dashboard/:id", (req, res) => {
		if (!req.user) res.redirect("/guess-that-number/auth");
		if (!/^\d+$/.test(req.params.id)) return res.render("error.pug", {
			user: req.user,
			code: 400,
			message: "That is not a valid Discord server ID."
		});
		const guild = bot.guilds.get(req.params.id) && bot.guilds.get(req.params.id).members.get(req.user.id) && bot.guilds.get(req.params.id).members.get(req.user.id).permission.has("manageGuild")) && { name: bot.guilds.get(req.params.id).name, memberCount: bot.guilds.get(req.params.id).memberCount, channelCount: bot.guilds.get(req.params.id).channels.size, roleCount: bot.guilds.get(req.params.id).roles.size, avatar: bot.guilds.get(req.params.id).avatar };
		if (guild) {
			res.render("dashboard/manage.pug", {
				user: req.user,
				server: guild
			});
		} else {
			res.render("error.pug", {
				user: req.user,
				code: "404",
				message: "Either that server doesn't exist or you don't have permission to manage it."
			});
		}
	});

	app.get("/statistics", (req, res) => {
		res.render("statistics.pug", {
			user: req.user,
			stats: {
				servers: bot.guilds.size,
				users: bot.users.size,
				channels: Object.keys(bot.channelGuildMap).length,
				uptime: humanizeduration(Date.now() - bot.startuptime, { round: true }),
				commands: Object.keys(bot.commands).length
			}
		});
	});

	app.get("/commands", (req, res) => {
		let sorted = [];
		Object.keys(bot.commands).forEach((v) => {
			if (sorted.filter((s) => s.category === bot.commands[v].category).length < 1) sorted.push({ category: bot.commands[v].category, commands: [] });
			sorted[sorted.indexOf(sorted.filter((s) => s.category === bot.commands[v].category)[0])].commands.push(bot.commands[v]);
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
		res.redirect("/guess-that-number/dashboard");
	});

	app.get("/auth/logout", (req, res) => {
		req.logout();
		res.redirect("/guess-that-number/");
	});

	app.use("/assets", express.static(__dirname + "/static"));

	app.use("*", (req, res) => {
		res.status(404).render("error.pug", {
			user: req.user,
			code: 404,
			message: "The requested page or resource was not found."
		});
	});
	
	const server = http.createServer(app);
	
	const io = socketio.listen(server);
	
	io.of("/statistics").on("connection", (socket) => {
		console.log("connection");

		let socketAlive = true;
		
		const send = () => {
			socket.emit("data", {
				servers: bot.guilds.size,
				users: bot.users.size,
				channels: Object.keys(bot.channelGuildMap).length,
				uptime: humanizeduration(Date.now() - bot.startuptime, { round: true }),
				commands: Object.keys(bot.commands).length
			});
			console.log('send');
			if (socketAlive) setTimeout(send, 1000);
		};
		
		send();
		
		socket.on("disconnect", () => {
			socketAlive = false;	
		});
	});

	server.listen(config.website_port, () => {
		log("Website listening on port " + config.website_port + ".");
	});
};
