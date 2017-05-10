'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FoodCatalog', {
   role:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:'member'
    },
    level:DataTypes.INTEGER,
    foodId:DataTypes.INTEGER,
    catalogId:DataTypes.INTEGER
  });
};
