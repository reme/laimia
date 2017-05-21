'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Catalogs', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    shopId: DataTypes.INTEGER,
    classid:DataTypes.STRING
  });
};
