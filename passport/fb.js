
let FacebookStrategy = require('passport-facebook').Strategy;
let User = require('../models/user');
require(dotenv).config()
const FBclientID = process.env.KEY_FB;
const FBclientSecret = process.env.SECRET_FB;

module.exports = (passport) => {

  passport.use(new FacebookStrategy({
    clientID: FBclientID,
    clientSecret: FBclientSecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email']
  }, async (access_token, refresh_token, profile, done) => {

    // find the user in the database based on their facebook id
    const user = await User.findOne({ fb_id: profile.id })
    if (user) {
      return done(null, user); // user found, return that user
    } else {
      // if there is no user found with that facebook id, create them
      // console.log(profile);
      
      const newUser = new User(
        {
          fb_id: profile.id,
          password: access_token,
          userName: profile.displayName,
          email: profile.email

        })
      // save our user to the database
      await newUser.save(function (err) {
        if (err)
          throw err;
        return done(null, newUser);
      });
    }
  }));
};