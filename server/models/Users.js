const Followers = require("./Followers");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  //hasMany -> one to many
  //belongsToMany -> many to many
  Users.associate = (models) => {
    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    Users.belongsToMany(models.Users, {
      foreignKey: "userId",
      as: "follower",
      through: models.Followers,
    });
    Users.belongsToMany(models.Users, {
      foreignKey: "followerId",
      as: "following",
      through: models.Followers,
    });
  };
  return Users;
};
