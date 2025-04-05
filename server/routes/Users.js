const express = require("express");
const router = express.Router();
const { Users, Followers } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { follow, unfollow } = require("../controller/FollowersController");

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

//To Do: follow user
router.post("/follow/:id", validateToken, follow); //we get here and call midware successfully

//To Do: unfollow user
router.post("/unfollow/:id", validateToken, unfollow);

//authorize
router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

// Route to check if the current user is following the target user
router.get("/follow-status/:id", validateToken, async (req, res) => {
  const currentUserId = req.user.id; // User id from token (the current user)
  const targetUserId = req.params.id; // The target user's id from URL params
  console.log(
    "from follow status route: currentUserId = " +
      currentUserId +
      " targetUserId = " +
      targetUserId
  ); //this works
  try {
    // Check if the current user is following the target user
    const following = await Followers.findOne({
      where: {
        followerId: currentUserId,
        followedId: targetUserId,
      },
    });

    console.log("user that we are following: " + following);

    // If `following` is found, the user is following, else not following
    const isFollowing = following ? true : false;

    // Send the result back
    res.json({ isFollowing });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking follow status" });
  }
});

//basic info for profile
router.get("/basicInfo/:id", async (req, res) => {
  const id = req.params.id;

  console.log("id from request: " + id);

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  console.log("profile info from route: " + basicInfo);

  res.json(basicInfo);
});

//change user's password
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
