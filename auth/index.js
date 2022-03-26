const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../db/models/users");

passport.serializeUser(async (user, done) => {
  const thisuser = await User.findByEmail(user.email);
  //console.log("serializing", thisuser);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  User.findByEmail(user.email).then(({ email }) => {
    done(null, user.email);
  });
});

const strategy = new LocalStrategy(
  { usernameField: "email", passwordField: "passwd" },
  (email, password, done) => {
    // console.log(`email ${email} password ${password}`);
    User.findByEmail(email.toLowerCase()).then(([user, ..._]) => {
      //console.log("found user", user);
      if (user !== undefined && bcrypt.compareSync(password, user.passwd)) {
        // console.log("user authd");
        return done(null, { id: user.id, email: user.email });
      } else {
        // console.log("user not authd");
        return done("That user was not found.", false);
      }
    });
  }
);

passport.use(strategy);

module.exports = passport;
