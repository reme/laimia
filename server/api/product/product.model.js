'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Product', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field:'id'
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    icon:DataTypes.STRING,
    picture:DataTypes.STRING,
    feature:DataTypes.STRING,
    catalogid:DataTypes.INTEGER,
    price:DataTypes.REAL,
    shopid:DataTypes.INTEGER,
    sold:DataTypes.INTEGER,
    discount:DataTypes.REAL,
    disprice:DataTypes.REAL
    },
    {
      tableName:'food',
      timestamps:false
    }
    );
};
