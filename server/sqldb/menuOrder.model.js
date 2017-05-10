'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menuOrder', {
   _id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    status:DataTypes.INTEGER,
     userId: DataTypes.INTEGER,
     roomId: DataTypes.INTEGER,
     shopId: DataTypes.INTEGER

  });
};
