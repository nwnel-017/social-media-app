const Users = require("./Users");

module.exports = (sequelize, DataTypes) => {
  const Followers = sequelize.define("Followers", {
    followerId: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: "id",
      },
    },
  });

  return Followers;
};
