function cookiesCleaner(req, res, next) {
  console.log('middleware func');
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
}

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.user) {
    res.render('index', { user: req.session.user });
  } else {
    next();
  }
};

module.exports = {
  sessionChecker,
  cookiesCleaner,
};
