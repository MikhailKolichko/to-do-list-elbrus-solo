const express = require('express');

const router = express.Router();
const handlebars = require('express-handlebars');
const path = require('path');
const User = require('../models/user');
const Party = require('../models/party');
const { sessionChecker } = require('../middleware/auth');
/* GET home page. */

const hbs = handlebars.create({
  defaultLayout: 'layout',
  extname: 'hbs',
  layoutsDir: path.join(__dirname, 'views'),
  partialsDir: path.join(__dirname, 'views/'),
});

const exposeTemplates = async (req, res, next) => {
  res.templateLogin = await hbs.getTemplate('views/login.hbs', {
    precompiled: true,
  });
  res.templateRegistration = await hbs.getTemplate('views/registration.hbs', {
    precompiled: true,
  });
  res.templateIndex = await hbs.getTemplate('views/index.hbs', {
    precompiled: true,
  });
  res.updateIndex = await hbs.getTemplate('views/update.hbs', {
    precompiled: true,
  });
  next();
};

router.get('/', async (req, res) => {
  if (req.session.user) {
    const parties = await Party.find().sort({ date: 1 });
    res.render('index', { user: req.session.user, party: parties });
  } else {
    res.redirect('registration');
  }
});


router.get('/login', async (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  req.session.user = user;
  console.log(req.session.user);

  res.redirect('/');
});


router.post('/registration', async (req, res) => {
  const userCheck = User.findOne({email: req.body.email})
  if(userCheck){
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

router.get('/logout', async (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
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


module.exports = router;
