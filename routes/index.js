const express = require('express');

const router = express.Router();
const User = require('../models/user');
const Party = require('../models/party');
const passport = require('passport');
const { yandexGeocoder } = require('nodejs-yandex-geocoder')

// facebook auth

router.get('/login/facebook',
  passport.authenticate('facebook', { authType: 'rerequest' }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {

    req.session.user = req.user
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/', async (req, res) => {
  if (req.session.user) {
    const parties = await Party.find().sort({ date: 1 });
    res.render('index', { user: req.session.user, party: parties });
  } else {
    res.redirect('registration');
  }
});

// login

router.get('/login', async (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.render('login', { error: 'пользователь не найден' });
  } else if (req.body.password !== user.password) {
    return res.render('login', { error: 'неверный пароль' });
  }

  req.session.user = user;

  res.redirect('/');
});

//registration

router.post('/registration', async (req, res) => {
  const userCheck = User.findOne({ email: req.body.email })
  if (userCheck) {
    res.redirect('/registration')
  }

  const user = new User({
    userName: req.body.login,
    email: req.body.email,
    password: req.body.password,
  });
  await user.save();
  req.session.user = user;
  console.log(req.session.user);
  res.redirect('/');
});


router.get('/registration', async (req, res) => {
  res.render('registration');
});

// logout

router.get('/logout', async (req, res, next) => {
  if (req.session.user) {
    try {
      await req.session.destroy();
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  } else {
    res.redirect('/login');
  }
});

// maps
router.get('/maps', async (req, res) => {

  
  res.render('maps', { user: req.session.user });
});






module.exports = router;
