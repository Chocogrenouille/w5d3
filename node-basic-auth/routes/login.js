const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

// Landing Page for Login
router.get('/login', (req, res, next) => {
    res.render('login');
})

// Login Post request
router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    User.findOne({username: username})
    // check whether entered username exists
        .then(userFromDb => {
            if (userFromDb === null) {
                res.render('login', {message: 'invalid credentials - try again'});
                return;
            }
            // if it does, compare whether entered password is the one of that username
            if (bcrypt.compareSync(password, userFromDb.password)) {
                // creates session
                req.session.user = userFromDb;
                // redirects to profile once logged in
                res.redirect('/profile');
            }
        })
})

// Logging out
router.get('/logout', (req, res, next) => {
    // destroy() needed to logout
    req.session.destroy( error => {
        if (error) {
            next(error);
        // then we redirect to landing page
        } else {
            res.redirect('/');
        }
    })
})

// This one here is a middleware that checks with every visit whether user is still logged in
const loginCheck = () => {
    return (req, res, next) => {
      if (req.session.user) {
        next();
      } else {
        res.redirect('/login');
      }
    }
}

// 1. Profile page still needed as redirect is only used to redirect to this path
// 2. This get request is also used to check whether user is logged in --> add loginCheck() as parameter
router.get('/profile', loginCheck(), (req, res, next) => {
    res.render('profile');
})

module.exports = router; 