const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Users = require("./Users"); // Assuming the Users model file path
const Tours = require("./Tours"); // Assuming the Tours model file path

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

module.exports = UserTours;
