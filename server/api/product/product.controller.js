/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  update
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var sqldb = require('../../sqldb');
var Product = sqldb.Product;
var path = require('path');
function handleError(res, statusCode) {
  
  statusCode = statusCode || 500;

  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      console.log("entity:",entity);
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(function(updated) {
        console.log("updated:",updated);
        sqldb.FoodCatalogs.destroy({
          where:{
            productId:entity._id
          }
        }).then(function(){
          var newFoodCatalogs=[];
          console.log("updates:",updates);
        for(var i=0; i<updates.Catalogs.length;i++){
           var temp = {};
           console.log("updated._id:",updated._id);
           temp.ProductId=updated._id;
           temp.CatalogId=updates.Catalogs[i]._id;
           newFoodCatalogs.push(temp);
          }
          console.log("newFoodCatalogs:",newFoodCatalogs);
          sqldb.FoodCatalogs.bulkCreate(newFoodCatalogs,{fields:['ProductId','CatalogId']})
          .error(function(err){
            console.log("error:",err);
          });
        });
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

function saveFile(res, file) {
  return function(entity){
    //var newPath = '/assets/uploads/' + path.basename(file.path);
    entity.picture = path.basename(file.path);
    return entity.save()
          .then(function() {
            res.status(204).end();
          });
     }  
  }

// Gets a list of Products
exports.index = function(req, res) {
  console.log("reqest:",req.query['user']);
  sqldb.Product.findAll({
        where:{
          shopId:req.query['shopId']
        }
      }).then(responseWithResult(res))
        .catch(handleError(res));
    };
  /*sqldb.User.findAll({
    where:{
      name:req.query['user']
    }
  }).then(function(users){
    sqldb.UserShop.findAll({
      where:{
        userId:users[0]._id
      }
    }).then(function(usershops){
      console.log("usershops:",usershops[0].shopId);
      sqldb.Product.findAll({
        where:{
          shopId:usershops[0].shopId
        }
      }).then(responseWithResult(res))
        .catch(handleError(res));
    });
  });
 Product.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};*/
exports.catalog = function(req,res){
  console.log("query:",req.params.id);
  sqldb.Product.findById(req.params.id,{
    'include':[sqldb.Catalog]
  }).then(responseWithResult(res))
    .catch(handleError(res));
    

};

// Gets a single Product from the DB
exports.show = function(req, res) {
  sqldb.Product.findById(req.params.id,{
    'include':[sqldb.Catalog]
  }).then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
  };
  

// Creates a new Product in the DB
exports.create = function(req, res) {
  Product.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Product in the DB
exports.update = function(req, res) {
  console.log("req.body:",req.body);
  if (req.body._id) {
    delete req.body._id;
  }
  Product.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.upload = function(req, res) {
  var file = req.files.file;
  if(!file){
    return handleError(res)('File not provided');
  }

  Product.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveFile(res, file))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Product from the DB
exports.destroy = function(req, res) {
  Product.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
