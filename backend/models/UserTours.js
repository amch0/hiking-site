const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Users = require("./Users");
const Tours = require("./Tours");
const UserTours = sequelize.define(
  "UserTour",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
        onDelete: "CASCADE",
      },
    },
    tourId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Tours,
        key: "id",
        onDelete: "CASCADE",
      },
    },
  },
  {}
);

Users.hasMany(UserTours, { foreignKey: "userId" });
Tours.hasMany(UserTours, { foreignKey: "tourId" });
UserTours.belongsTo(Users, { foreignKey: "userId" });
UserTours.belongsTo(Tours, { foreignKey: "tourId" });

module.exports = UserTours;
