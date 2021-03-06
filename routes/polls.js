const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const Poll = require('../models/poll');

// INDEX - show all polls
router.get('/', function(req, res) {
    Poll.find({}, function(err, polls) {
        if (err) {
            console.error(err);
        } else {
            res.render('polls/index', {polls, page: "polls"});
        }
    });
});

// CREATE
router.post('/', middleware.isLoggedIn, function(req, res) {
    const { name, options } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username,
    };
    const votes = options.map(option => 0); // initialize votes to 0
    
    const newPoll = { name, options, author, votes };
    
    Poll.create(newPoll, function(err, createdPoll) {
        if (err) {
            console.error(err);
        } else {
            req.flash('success', 'Poll created!');
            res.redirect('/polls');
        }
    });
});

// NEW
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('polls/new');
});

// SHOW
router.get('/:id', function(req, res) {
    Poll.findById(req.params.id).exec(function(err, foundPoll) {
        if (err || !foundPoll) {
            req.flash('error', 'Poll not found.');
            res.redirect('back');
        } else {
            res.render('polls/show', {poll: foundPoll});
        }
    });
});

// VOTE (REQUIRING LOGIN, CAN PREVENT DUPLICATE VOTES)
router.post('/:id', middleware.isLoggedIn, function(req, res) {
    const { option } = req.body; // index of option
    const votePath = `votes.${ option }`;

    // increase the vote for that option by 1
    Poll.findByIdAndUpdate(req.params.id, { $inc: { [votePath]: 1 } }, {new: true}, function(err, updatedPoll) {
        if (err || !updatedPoll) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        req.flash('success', 'Voting successful.');
        res.redirect('/polls/' + req.params.id);
    });
});

// EDIT POLL
router.get('/:id/edit', middleware.checkPollOwnership, function(req, res) {
    Poll.findById(req.params.id).exec(function(err, foundPoll) {
        if (err || !foundPoll) {
            req.flash('error', 'Poll not found.');
            res.redirect('back');
        } else {
            res.render('polls/edit', {poll: foundPoll});
        }
    });
});

// UPDATE POLL
router.put('/:id', middleware.checkPollOwnership, function(req, res) {
    const { options } = req.body; // array of strings
    const votes = (typeof options === 'string') ? [0] : options.map(_ => 0); // vote slot for new options
              
        // find and update the poll
        Poll.findByIdAndUpdate(req.params.id, {$push: {options, votes}}, function(err, updatedCampground) { //req.body.campground
            if(err || !updatedCampground) {
                    req.flash("error", err.message);
                    return res.redirect("back");
            }
            req.flash("success", "Successfully updated poll.");
            res.redirect("/polls/" + req.params.id);
        });
});

// DESTROY POLL
router.delete('/:id', middleware.checkPollOwnership, function(req, res) {
    Poll.findByIdAndRemove(req.params.id, function(err, deletedPoll) {
        if (err || !deletedPoll) {
            req.flash('error', 'Poll not found.');
            res.redirect('back');
        } else {
            req.flash('success', 'Poll deleted successfully.');
            res.redirect('/polls');
        }
    });
});

module.exports = router;