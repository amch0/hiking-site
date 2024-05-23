const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Users = require("./Users");
const Tours = require("./Tours");

const Comments = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Other model options go here
  }
);

Users.hasMany(Comments, { foreignKey: "userId" });
Tours.hasMany(Comments, { foreignKey: "tourId" });
Comments.belongsTo(Users, { foreignKey: "userId" });
Comments.belongsTo(Tours, { foreignKey: "tourId" });

module.exports = Comments;
