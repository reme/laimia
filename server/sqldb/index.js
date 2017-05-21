/**
 * Sequelize initialization module
 */

'use strict';

var path = require('path');
var config = require('../config/environment');

var Sequelize = require('sequelize');

var db = {
  Sequelize: Sequelize,
  //sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
  sequelize: new Sequelize('test','cdb_outerroot','laowang60',{host:'58ac508769b5b.sh.cdb.myqcloud.com',port:7242,dialect:'mysql'})
};

// Insert models below
db.Catalogs = db.sequelize.import('../api/catalogs/catalogs.model');
db.Shop = db.sequelize.import('../api/shops/shops.model');
db.Catalog = db.sequelize.import('../api/catalog/catalog.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');

db.Product = db.sequelize.import('../api/product/product.model');
db.User = db.sequelize.import('../api/user/user.model');
//db.Shop = db.sequelize.import('./shop.model');
db.OrderItem = db.sequelize.import('./OrderItem.model');
db.MenuOrder = db.sequelize.import('./menuOrder.model');
db.Catalog = db.sequelize.import('../api/catalog/catalog.model');
db.Room = db.sequelize.import('./room.model');
db.Preference = db.sequelize.import('./preference.model');
db.UserShop = db.sequelize.import('./userShop.model');
//db.FoodCatalog = db.sequelize.import('./foodCatalog.model');
var FoodCatalogs = db.sequelize.define('foodCatalogs', {
  started: Sequelize.BOOLEAN
});
db.FoodCatalogs=FoodCatalogs;

db.User.belongsToMany(db.Shop,{through:db.UserShop,foreignKey:'userId'});
db.Shop.belongsToMany(db.User,{through:db.UserShop,foreignKey:'shopId'});
db.MenuOrder.belongsTo(db.User,{as:'orderUser',foreignKey:'userId'});
db.MenuOrder.belongsTo(db.Room,{as:'orderRoom',foreignKey:'roomId'});
db.MenuOrder.belongsTo(db.Shop,{as:'orderShop',foreignKey:'shopId'});
db.Room.belongsTo(db.Shop,{as:'Shop',foreignKey:'shopId'});
db.OrderItem.belongsTo(db.MenuOrder,{as:'menuOrder',foreignKey:'orderId'});
db.OrderItem.belongsTo(db.Product,{as:'orderFood',foreignKey:'foodId'});
db.Catalogs.belongsTo(db.Shop,{as:'catalogShop',foreignKey:'shopId'});
db.Product.belongsToMany(db.Catalogs,{through: FoodCatalogs});
db.Catalogs.belongsToMany(db.Product,{through: FoodCatalogs});

module.exports = db;






































