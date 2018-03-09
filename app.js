const express = require('express');
const app = express(),
      flash = require('connect-flash'),
      bodyParser = require('body-parser'),
      mongoose   = require("mongoose"),
      passport   = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override");
      
const User = require('./models/user');
const Poll = require('./models/poll');

require('dotenv').load();

const indexRoutes = require('./routes/index');
const pollRoutes = require('./routes/polls');

const PORT = process.env.PORT || 8080;

const url = process.env.MONGO_URI;
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require('express-session')({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error    = req.flash('error');
    res.locals.success  = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/polls', pollRoutes);

app.get('/profile/:id', function(req, res) {
    const { id } = req.params;
    User.findOne({ _id: id }, function(err, user) {
        if (err || !user) {
            req.flash('error', 'User not found.');
            return res.redirect('back');
        }
        Poll.find({ "author.id": id }, function(err, polls) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            
            res.render('profile', { polls, user, page: 'profile' });
        });
    });
});

app.listen(PORT, process.env.IP, function() {
    console.log(`Voting App server started on port ${PORT}`);
});