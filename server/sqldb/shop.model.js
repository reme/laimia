'use strict';

var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var Shop = sequelize.define('Shop', {

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
    shopaddress:DataTypes.STRING,
    phone:DataTypes.STRING,
    description:DataTypes.STRING,
    img:DataTypes.STRING,
    logo:DataTypes.STRING,

    }, {

    /**
     * Virtual Getters
     */
    getterMethods: {
      // Public profile information
      profile: function() {
        return {
          'name': this.name,
          'address': this.shopaddress
        };
      },
    },

    /**
     * Pre-save hooks
     */
    hooks: {
      beforeBulkCreate: function(shops, fields, fn) {
        var totalUpdated = 0;
        shops.forEach(function(shop) {
            totalUpdated += 1;
            if (totalUpdated === shops.length) {
              return fn();
            }
          });
        
      },
      beforeCreate: function(shop, fields, fn) {
        
      },
      beforeUpdate: function(user, fields, fn) {
        
    },

    /**
     * Instance Methods
     */
    instanceMethods: {
      
      makeSalt: function(byteSize, callback) {
        
      },

    } 
  }
  });

  return Shop;
};
