const { Users } = require("../models");

class FollowersController {
  static async validateFollowable(user, username) {
    //   try {
    //     const follower = await Users.findOne({ where: { id: user.id } });
    //   } catch (error) {
    //     throw error;
    //   }
  }

  static async follow(request, response, next) {
    //how do we get user who is logged in
    const userId = request.user.id;
    const follower = request.user;
    const followId = request.params.id;
    console.log(userId + " is following user..." + followId);
    console.log("follower: " + JSON.stringify(follower));
    try {
      const userToFollow = await Users.findByPk(followId);
      await userToFollow.addFollower(userId); //sequelize addx is a built in helper function -> add + name of table camel case
      console.log(userToFollow);
      response.send(follower);
    } catch (error) {
      next(error);
    }
    // await user.addFollower(user);
  }

  static async unfollow(request, response, next) {
    console.log("unfollowing user...");
    const followingId = request.params.id; //id of user we are following
    const followerId = request.user.id;
    console.log("user we are following: " + followingId);

    try {
      const userToUnfollow = await Users.findByPk(followingId);
      if (!userToUnfollow) {
        return response.status(404).json({
          message: "User to unfollow not found",
        });
      }

      // Check if the current user is following the target user
      const isFollowing = userToUnfollow.hasFollower(followerId);
      if (!isFollowing) {
        return response.status(400).json({
          message: "You are not following this user",
        });
      }

      // Remove the follower relationship
      await userToUnfollow.removeFollower(followerId);

      //send success response
      response.status(200).json({ status: "unfollowed successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FollowersController;
