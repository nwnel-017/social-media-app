const Users = require("./Users");

module.exports = (sequelize, DataTypes) => {
  const Followers = sequelize.define("Followers", {
    followerId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users", // Assuming the Users table name is 'Users'
        key: "id",
      },
    },
    followedId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users", // Assuming the Users table name is 'Users'
        key: "id",
      },
    },
  });

  return Followers;
};
