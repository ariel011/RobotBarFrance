const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const User = require('../../model/User');

router.post('/register', (req, res) => {
    let {
        name,
        username,
        email,
        password,
        confirm_password
    } = req.body
    if (password !== confirm_password) {
        return res.status(400).json({
            msg: "HA! Wrong password."
        });
    }
    
    User.findOne({
        username: username
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "The username has already been taken."
            });
        }
    })
    // email check
    User.findOne({
        email: email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "One of two things happened, you either have been here before or someone has been using your email. Probably the former."
            });
        }
    });
    let newUser = new User({
        name,
        username,
        password,
        email
    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    msg: "Congratulations you created an account."
                });
            });
        });
    });
});


router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                msg: "Username cannot be found.",
                success: false
            });
        }
        // check password
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                // good pass
                const payload = {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email
                }
                jwt.sign(payload, key, {
                    expiresIn: 604800
                }, (err, token) => {
                    res.status(200).json({
                        success: true,
                        token: `Bearer ${token}`,
                        user: user,
                        msg: "Congratulations, you did a thing and youre in!"
                    });
                })
            } else {
                return res.status(404).json({
                    msg: "Incorrect password.",
                    success: false
                });
            }
        })
    });
});


router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    return res.json({
        user: req.user
    });
});
module.exports = router;