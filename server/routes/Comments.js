const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { postId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  // const username = "test"; //this works when we manually enter username
  console.log("username from routes/comments: " + username); //this is undefined -> username is not getting stored properly -> in routes/Users
  comment.username = username; //issue -> username is null
  await Comments.create(comment);
  res.json({ username: req.user.username, id: comment.id });
});

router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId; //this is undefined

  console.log("deleting comment in backend: " + commentId);

  await Comments.destroy({
    where: {
      id: commentId,
    },
  });
  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
