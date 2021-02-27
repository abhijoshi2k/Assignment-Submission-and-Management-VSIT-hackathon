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
		Class.find(
			{ code: { $in: req.user.memberClass } },
			function (err, croomMem) {
				if (err) {
					res.send('Some error occurred');
				} else {
					Class.find(
						{ admin: req.user.username },
						(err, croomAdm) => {
							if (err) {
								res.send('Some error occurred');
							} else {
								res.render('dashboard_sample', {
									croomMem: croomMem,
									me: req.user.username,
									croomAdm: croomAdm
								});
							}
						}
					);
				}
			}
		);
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
					res.render('classroom-admin-sample', {
						croom: croom,
						admin: true
					});
				} else if (req.user.memberClass.includes(req.params.code)) {
					res.render('classroom-admin-sample', {
						croom: croom,
						admin: false
					});
				} else {
					res.status(404).send('404 Not Found!');
				}
			} else {
				res.status(404).send('<h1>404 Not Found!</h1>');
			}
		});
	} else {
		res.redirect('/login');
	}
});

app.get('/add/:code', (req, res) => {
	if (req.isAuthenticated()) {
		if (req.user.adminClass.includes(req.params.code)) {
			Class.where({ code: req.params.code }).findOne((err, croom) => {
				if (err) {
					res.send('Server Error');
				} else if (croom) {
					res.render('add-assignment', {
						code: req.params.code,
						name: croom.name
					});
				} else {
					res.send('Server Error');
				}
			});
		} else {
			res.status(404).send('<h1>404 Not Found!</h1>');
		}
	} else {
		res.redirect('/login');
	}
});

app.get('/classroom/:code/:assignment', (req, res) => {
	if (req.isAuthenticated()) {
		if (req.user.adminClass.includes(req.params.code)) {
			Class.where({ code: req.params.code }).findOne((err, croom) => {
				if (err) {
					res.status(404).send('<h1>404 Not Found!</h1>');
				} else if (croom) {
					if (croom.assignments[parseInt(req.params.assignment)]) {
						res.render('classroom-admin-assignment', {
							code: req.params.code,
							no: req.params.assignment,
							name: croom.name,
							assignment:
								croom.assignments[
									parseInt(req.params.assignment)
								]
						});
					}
				} else {
					res.status(404).send('<h1>404 Not Found!</h1>');
				}
			});
		} else if (req.user.memberClass.includes(req.params.code)) {
			Class.where({ code: req.params.code }).findOne((err, croom) => {
				if (croom.assignments[parseInt(req.params.assignment)]) {
					let sub = false;
					croom.assignments[
						parseInt(req.params.assignment)
					].submissions.forEach((submission) => {
						if (submission.email == req.user.username) {
							sub = submission;
						}
					});

					if (sub == false) {
						res.render('upload', {
							title:
								croom.assignments[
									parseInt(req.params.assignment)
								].title,
							desc:
								croom.assignments[
									parseInt(req.params.assignment)
								].description
						});
					}
				} else {
					res.status(404).send('<h1>404 Not Found!</h1>');
				}
			});
		} else {
			res.status(404).send('<h1>404 Not Found!</h1>');
		}
	} else {
		res.redirect('/login');
	}
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
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

		croom.save(() => {
			req.user.adminClass.push(code);
			req.user.save(() => {
				res.redirect('/classroom/' + code);
			});
		});
	}
});

app.post('/join-class', (req, res) => {
	if (req.isAuthenticated()) {
		if (req.user.adminClass.includes(req.body.code)) {
			res.send('<p>You are admin of this class!</p>');
		} else if (req.user.memberClass.includes(req.body.code)) {
			res.redirect('/classroom/' + req.body.code);
		} else {
			Class.where({ code: req.body.code }).findOne((err, croom) => {
				if (err) {
					res.send('Class not found!');
				} else if (croom) {
					croom.members.push(req.user.username);
					croom.save(() => {
						req.user.memberClass.push(req.body.code);
						req.user.save(() => {
							res.redirect('/classroom/' + req.body.code);
						});
					});
				} else {
					res.send('Class not found!');
				}
			});
		}
	} else {
		res.status(404);
	}
});

app.post('/add/:code', (req, res) => {
	if (req.isAuthenticated()) {
		if (req.user.adminClass.includes(req.params.code)) {
			Class.where({ code: req.params.code }).findOne((err, croom) => {
				if (err) {
					res.send('Server Error');
				} else if (croom) {
					croom.assignments.push({
						givenDate: new Date().getTime(),
						dueDate: parseInt(req.body.hide),
						title: req.body.title,
						description: req.body.description,
						submissions: []
					});
					croom.save(() => {
						res.redirect('/classroom/' + req.params.code);
					});
				} else {
					res.send('Server Error');
				}
			});
		} else {
			res.status(404).send('<h1>404 Not Found!</h1>');
		}
	} else {
		res.redirect('/login');
	}
});

app.post('/classroom/:code/:assignment/grade', (req, res) => {
	if (req.isAuthenticated()) {
		if (req.user.adminClass.includes(req.params.code)) {
			Class.where({ code: req.params.code }).findOne((err, croom) => {
				if (err) {
					res.status(404).send('<h1>404 Not Found!</h1>');
				} else if (croom) {
					if (croom.assignments[parseInt(req.params.assignment)]) {
						for (
							let i = 0;
							i <
							croom.assignments[parseInt(req.params.assignment)]
								.submissions.length;
							i++
						) {
							if (
								croom.assignments[
									parseInt(req.params.assignment)
								].submissions[i].email == req.body.email
							) {
								croom.assignments[
									parseInt(req.params.assignment)
								].submissions[i].graded = true;
								croom.assignments[
									parseInt(req.params.assignment)
								].submissions[i].grade = parseInt(
									req.body.grade
								);
								croom.save(() => {
									res.redirect(
										'/classroom/' +
											req.params.code +
											'/' +
											req.params.assignment
									);
								});
							}
							break;
						}
					}
				} else {
					res.status(404).send('<h1>404 Not Found!</h1>');
				}
			});
		} else {
			res.status(404).send('<h1>404 Not Found!</h1>');
		}
	} else {
		res.redirect('/login');
	}
});

app.use((req, res, next) => {
	res.status(404).send('<h1>404! Not Found</h1>');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
