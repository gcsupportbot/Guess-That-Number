const express = require('express');
const path = require('path');
const passport = require('passport');
const passportDiscord = require('passport-discord');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
let expressWS = require('express-ws');
const config = require('../config.json');
const log = require('../util/logger.js');

module.exports = (bot, r) => {	
	const app = express();

	expressWS = expressWS(app);

	passport.use(new passportDiscord.Strategy({
		clientID: bot.user.id,
		clientSecret: config.secret,
		scope: ['identify'],
		callbackURL: '/auth/callback'
	}, (accessToken, refreshToken, profile, done) => {
		if (accessToken !== null) {
			r.table('developers').get(profile.id).run((error, developer) => {
				if (error) return done(error, null);
				profile.isDeveloper = developer !== null;
				r.table('users').insert(profile, { conflict: 'replace' }).run((error) => {
					if (error) return done(error, null);
					done(null, profile);
				});
			});
		}
	}));

	passport.serializeUser((user, done) => done(null, user.id));

	passport.deserializeUser((id, done) => {
		r.table('users').get(id).run(r.conn).then((user) => {
			done(null, user);
		});
	});
	
	app.set('view engine', 'pug');
	app.set('views', path.join(__dirname, 'dynamic'));

	app.use(cookieSession({
		name: 'session',
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

	app.use((req, res, next) => {
		res.locals.user = req.user;
		next();
	});
	
	app.get('/', (req, res) => {
		res.render('index.pug', {
			page: 1,
			servers: bot.guilds.size,
			users: bot.users.size
		});
	});

	app.get('/documentation', (req, res) => {
		res.render('documentation/index.pug', {
			page: 2
		});
	});
	
	app.get('/documentation/commands', (req, res) => {
		res.render('documentation/commands.pug', {
			page: 2,
			commands: bot.commands.sort((a, b) => {
				if (a.category.toLowerCase() > b.category.toLowerCase()) return 1;
				if (a.category.toLowerCase() < b.category.toLowerCase()) return -1;
				return 0;
			})
		});
	});
	
	app.get('/documentation/donating', (req, res) => {
		res.render('documentation/donating.pug', {
			page: 2
		});
	});
	
	app.get('/documentation/faq', (req, res) => {
		res.render('documentation/faq.pug', {
			page: 2
		});
	});
	
	app.get('/admin', (req, res) => {
		if (!req.user || !req.user.isDeveloper) return res.status(401).render('error.pug', {
			code: 401
		});
		r.table('games').count().run((error, activeGames) => {
			if (error) {
				res.status(500).render('error.pug', {
					code: 500
				});
				console.error(error);
				return;
			}
			res.render('admin/index.pug', {
				servers: bot.guilds.size,
				users: bot.users.size,
				channels: Object.keys(bot.channelGuildMap).length,
				activeGames: activeGames
			});
		});
	});
	
	app.get('/admin/games', (req, res) => {
		if (!req.user || !req.user.isDeveloper) return res.status(401).render('error.pug', {
			code: 401
		});
		r.table('games').run((error, games) => {
			if (error) {
				res.status(500).render('error.pug', {
					code: 500
				});
				console.error(error);
				return;
			}
			res.render('admin/games.pug', {
				games: games
			});
		});
	});

	app.ws('/admin/games', (ws, req) => {
		if (!req.user || !req.user.isDeveloper) return ws.close(1);
		r.table('games').run((error, games) => {
			if (error) return console.error(error);
			ws.send(JSON.stringify({
				op: 1,
				t: Date.now(),
				d: games.map((g) => {
					const user = bot.users.get(g.id);
					g.tag = user ? user.username + '#' + user.discriminator : 'Unknown';
					return g;
				})
			}));
		});
		const interval = setInterval(() => {
			r.table('games').run((error, games) => {
				if (error) return console.error(error);
				ws.send(JSON.stringify({
					op: 1,
					t: Date.now(),
					d: games.map((g) => {
						const user = bot.users.get(g.id);
						g.tag = user ? user.username + '#' + user.discriminator : 'Unknown';
						return g;
					})
				}));
			});
		}, 1000);
		ws.on('close', () => {
			clearInterval(interval);
		});
	});

	app.get('/invite', (req, res) => {
		res.redirect('https://discordapp.com/oauth2/authorize?client_id=307994108792799244&scope=bot');
	});

	app.get('/server', (req, res) => {
		res.redirect('https://discord.gg/3hqURjk');
	});

	app.get('/auth', passport.authenticate('discord'));

	app.get('/auth/callback', passport.authenticate('discord'), (req, res) => {
		res.redirect('/');
	});

	app.get('/auth/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	app.use(express.static(path.join(__dirname, 'static')));

	app.use((req, res) => {
		res.status(404).render('error.pug', {
			code: 404
		});
	});

	app.listen(config.website_port, () => {
		log.info('Listening on port ' + config.website_port + '.');
	});
};