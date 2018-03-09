const Poll = require('../models/poll');

let middlewareObj = {};

middlewareObj.checkPollOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Poll.findById(req.params.id).exec(function(err, foundPoll) {
            if (err || !foundPoll) {
                req.flash('error', 'Poll not found.');
                res.redirect('back');
            } else {
                // check ownership
                if (foundPoll.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that.");
                    res.redirect('/polls');
                }
            }
        })
    } else {
        req.flash('error', 'You must be logged in to do that.');
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to do that.');
    res.redirect('/login');
}

module.exports = middlewareObj;