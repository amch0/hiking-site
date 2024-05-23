const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Tours = sequelize.define(
  "Tour",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    equipment: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    limit_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remaining_space: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: function () {
        return this.limit_number;
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("images");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("images", JSON.stringify(value));
      },
    },
  },
  {}
);

module.exports = Tours;
