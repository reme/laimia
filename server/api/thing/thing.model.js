'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Thing', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    info: DataTypes.STRING,
    picture:DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
};
