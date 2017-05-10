'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Preference', {
   _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
   beginTime:DataTypes.DATE,
   endTime:DataTypes.DATE,
    discount:DataTypes.FLOAT
  });
};
