const express = require("express");
const router = express.Router();
const { Posts, Likes, Followers, sequelize } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const Users = require("../models/Users");
const { DataTypes } = require("sequelize");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] }); //sequelize eager loading -> uses this to join tables
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

//new route to get posts of users we are following
router.get("/following", validateToken, async (req, res) => {
  const id = req.user.id;
  const followers = await Followers.findAll({
    where: {
      followerId: id,
    },
  });
  const followerIds = await followers.map((x) => x.userId);
  const listOfPosts = await Posts.findAll({
    where: {
      UserId: [id, ...followerIds],
    },
    include: [Likes],
  });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

//query post based on user's id
router.get("/byUserId/:uid", async (req, res) => {
  const uid = req.params.uid;
  const listOfPosts = await Posts.findAll({
    where: { UserId: uid },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
