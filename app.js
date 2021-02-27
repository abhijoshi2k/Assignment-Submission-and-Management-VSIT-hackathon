require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
require('ejs');
const session = require('express-session');
const passport = require('passport');

require('./db/mongoose');

const User = require('./schema/userSchema');
const Class = require('./schema/classSchema');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(
	session({
		// eslint-disable-next-line no-undef
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/login', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/dashboard');
	} else {
		res.render('login');
	}
});

app.get('/signup', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/dashboard');
	} else {
		res.render('register');
	}
});

app.get('/dashboard', (req, res) => {
	if (req.isAuthenticated()) {
		res.render('dashboard_sample');
	} else {
		res.redirect('/login');
	}
});

app.get('/classroom/:code', (req, res) => {
	if (req.isAuthenticated()) {
		Class.where({ code: req.params.code }).findOne((err, croom) => {
			if (err) {
				res.status(404).send('<h1>404 Not Found!</h1>');
			} else if (croom) {
				if (req.user.adminClass.includes(req.params.code)) {
					res.render('classroom-admin', { croom: croom });
				} else if (req.user.memberClass.includes(req.params.code)) {
					res.render('classroom-member', { croom: croom });
				}
			} else {
				res.status(404).send('<h1>404 Not Found!</h1>');
			}
		});
	} else {
		res.redirect('/login');
	}
});

app.post('/login', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/home');
	} else if (
		!(req.body.username && req.body.password) ||
		req.body.username == '' ||
		req.body.password == ''
	) {
		res.redirect('/login');
	} else {
		const user = new User({
			username: req.body.username,
			password: req.body.password
		});

		req.login(user, (err) => {
			if (err) {
				console.log(err);
				res.send({ message: 'Incorrect Email Address or Password' });
			} else {
				passport.authenticate('local')(req, res, () => {
					res.send({ message: 'Done' });
				});
			}
		});
	}
});

app.post('/signup', (req, res) => {
	if (req.isAuthenticated()) {
		res.status(404);
	} else if (req.body.password !== req.body.passwordagain) {
		res.send({ message: 'Passwords do not match' });
	} else {
		User.register(
			{ username: req.body.username },
			req.body.password,
			(err, user) => {
				if (err) {
					if (err.name === 'UserExistsError') {
						res.send({
							message: 'User already registered!'
						});
					} else {
						console.log(err);
					}
				} else {
					passport.authenticate('local')(req, res, () => {
						res.send({ message: 'done' });
					});
				}
			}
		);
	}
});

app.post('/create-class', (req, res) => {
	if (req.isAuthenticated()) {
		let code = new Date().getTime().toString(36);
		let croom = new Class({
			code: code,
			admin: req.user.username,
			name: req.body.name,
			members: [],
			assignments: []
		});

		croom.save();

		req.user.adminClass.push(code);
		req.user.save();

		res.redirect('/classroom/' + code);
	}
});

app.use((req, res, next) => {
	res.status(404).send('<h1>404! Not Found</h1>');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
