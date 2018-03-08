const express = require('express'),
      router  = express.Router(),
      middleware = require('../middleware'),
      passport = require('passport'),
      User     = require('../models/user');
      
      
router.get('/', function(req, res) {
    res.render('home', {page: 'home'});
});

// REGISTER ROUTES

// show register form
router.get("/register", function(req, res) {
    res.render('register', {page: 'register'});
});

router.post('/register', function(req, res) {
    const newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.error(err);
            return res.render('register', {error: err.message});
        }
        passport.authenticate('local')(req, res, function() {
            req.flash('success', 'Welcome to VotePlex, ' + user.username + '!');
            res.redirect('/');
        })
    });
});

// LOGIN ROUTES

// show login form
router.get('/login', function(req, res) {
    res.render('login', {page: 'login'});
});

// handle login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:    'Invalid credentials.  Username and Password do not match.',
    successFlash:    'Signed in.',
}));

// LOGOUT ROUTE
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'Logged out successfully.');
    res.redirect('/');
});

module.exports = router;