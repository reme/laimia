'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OrderItem', {
   _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    status:DataTypes.INTEGER,
    num:DataTypes.INTEGER,
    price:DataTypes.FLOAT,
    discount:DataTypes.FLOAT,
    foodId: DataTypes.INTEGER,
    orderId:DataTypes.STRING


  });
};
