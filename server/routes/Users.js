const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

//create user
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
  });
});

//login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("username " + username + " password " + password);
  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "user doesn't exist!" });
  else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match)
        res.json({
          error: "Wrong username and password combination!",
        });
      else {
        const accessToken = sign(
          {
            username: user.username,
            id: user.id,
          },
          "importantsecret"
        );
        res.json({ token: accessToken, username: username, id: user.id });
      }
    });
  }
});

//authorize
router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

//basic info for profile
router.get("/basicInfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } }); //we get username from validateToken

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });
    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS!");
    });
  });
});

module.exports = router;
