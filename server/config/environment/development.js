'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/food-dev'
  },
  sequelize: {
    uri:'mysql://cdb_outerroot:laowang60@58ac508769b5b.sh.cdb.myqcloud.com:7242/test',
    options:{
        dialect: 'mysql',
        pool: {
              max: 5,
              min: 0,
              idle: 10000
              }
    }
  },

  seedDB: false
};
