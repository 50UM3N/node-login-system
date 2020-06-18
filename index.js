if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require('./schema');
const flash = require('express-flash');
const passport = require('passport');
const cookie = require('cookie-session');
const authenticator = require('./passport-strategy');
const nodemailer = require('nodemailer');
const sendmail = require('./sendmail');
const port = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('Database Connected');
    });


authenticator(passport, user);
app.use(cookie({
    maxAge: 30 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    user.findOne({ email: email }, (err, data) => {
        if (err) {
            req.flash('msg', 'Sign Up Unsuccessful');
            res.redirect('/signup');
        }
        if (data) {
            if (data.email == email) {
                req.flash('msg', 'Email already taken');
                res.redirect('/signup');
            }
        }
        else {
            user({
                username,
                email,
                password
            }).save((err, data) => {
                if (err) {
                    console.log('Error in database')
                    req.flash('msg', 'Sign Up Unsuccessful');
                    res.redirect('/signup');
                }
                if (data) {
                    console.log(data);
                    req.flash('success', 'Sign Up Successful')
                    res.redirect('/login');
                }
            })
        }
    })
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
app.post('/submit', authorize, (req, res) => {
    const message = req.body.comment;
    user.findOneAndUpdate(
        { email: req.user.email },
        {
            $push: {
                comment: message
            }
        }, (err, data) => {
            if (err) {
                console.log(err)
            }
            if (data) console.log(data);
        })
    req.flash('msg', 'Message added');
    res.redirect('/');
});
app.post('/nodemailer', (req, res) => {
    sendmail({
        nodemailer: nodemailer,
        email: process.env.MAIL,
        password: process.env.PASSWORD,
        data: req.body
    }, (err, success) => {
        if (err) {
            req.flash('err', 'Message not send')
            return res.redirect('/nodemailer')
        }
        if (success) {
            req.flash('success', 'Message send')
            return res.redirect('/nodemailer')
        }
    })
})


app.get('/', authorize, (req, res) => {
    res.render('index.ejs', { user: req.user });
});
app.get('/login', notAuthorize, (req, res) => {
    res.render('login.ejs');
});
app.get('/signup', notAuthorize, (req, res) => {
    res.render('signup.ejs');
});
app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login')
})
app.get('/nodemailer', (req, res) => {
    res.render('nodemail.ejs')
})
app.listen(port, (e) => {
    if (e) console.log(e)
    else console.log(`Listen on: http://127.0.0.1:${port}`);
})
function authorize(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
function notAuthorize(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}