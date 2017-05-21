'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userShop', {
   role:{
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:'member'
    },
    level:DataTypes.INTEGER,
    userId:DataTypes.INTEGER,
    shopId:DataTypes.INTEGER
  });
};
