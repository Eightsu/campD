let express = require('express')
let router = express.Router();

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/register', (req, res) => {
	res.render('register');
});

// Handle Register form
app.post('/register', (req, res) => {
	const newUser = new User({ username: req.body.username });
	// eslint-disable-next-line no-unused-vars
	// eslint-disable-next-line consistent-return
	// eslint-disable-next-line no-unused-vars
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render('/register');
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/campgrounds');
		});
	});
});

// Show Login Form
app.get('/login', (req, res) => { res.render('login'); });

// Handle Login Form
app.post('/login', passport.authenticate('local',
	{ // Middleware
		successRedirect: '/campgrounds',
		failureRedirect: '/login',
		// eslint-disable-next-line no-unused-vars
	}), (req, res) => { });

// Logout route
app.get('/logout', (req, res) => {
	req.logOut();
	res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); // REMEMBER TO ALWAYS INVOKE NEXT ON RETURN OR NOTHING HAPPENS.
	}
	res.redirect('/login');
}