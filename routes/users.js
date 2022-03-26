const express = require("express");
const router = express.Router();
const passport = require("../auth");
const User = require("../db/models/users");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  res.render("unauthenticated/users/login");
});

router.post(
  "/login",
  async (req, res) => {
    //console.log(`logging in`, req.body);
    if (req.body.email.length == 0 || req.body.password.length == 0) {
      console.log("user not authd");
      res.redirect("/users/login");
    } else {
      req.login(req.body, (error) => {
        if (error) {
          throw error;
        }
        User.findByEmail(req.body.email.toLowerCase())
          .then(([user, ..._]) => {
            //console.log("found user", user);
            if (
              user !== undefined &&
              req.body.email !== undefined &&
              req.body.password !== undefined &&
              bcrypt.compareSync(req.body.password, user.passwd)
            ) {
              req.session.save(() => {
                res.redirect("/lobby");
              });
            } else {
              console.log("user not authd");
              res.redirect("/users/login");
            }
          })
          .catch(function (err) {
            res.json({ error: err.message });
          });
      });
    }
  }
  // passport.authenticate("local", {
  //   failureRedirect: "/users/login",
  //   successRedirect: "/lobby",
  // })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/register", (req, res) => {
  res.render("unauthenticated/users/register");
});

router.post("/register", (req, res, next) => {
  // req.flash("flash register");
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.redirect("register");
  } else if ((!username, !email, !password, !confirmPassword)) {
    res.redirect("register");
  } else {
    try {
      User.findUser(email, username)
        .then((userExists) => {
          // if (users !== undefined || users.length !== 0) {
          //   res.redirect("register");
          if (userExists) {
            throw new Error("user already exists");
          }
        })
        .then(() => {
          return User.create(username, email, password);
        })
        .then((user) => {
          console.log("created user", user);
          req.login(req.body, (error) => {
            if (error) {
              throw error;
            }
            req.session.save(() => {
              res.redirect("/lobby");
            });
          });
        })
        .catch(function (err) {
          res.json({ error: err.message });
        });
    } catch (err) {
      console.error(err);
    }
  }
});

module.exports = router;
