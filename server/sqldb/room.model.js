'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Room', {
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
    description:DataTypes.STRING,
    shopId:DataTypes.INTEGER 
    
  });
};
