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
var fs = require('fs');
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
          if(updates.Catalogs){
            var newFoodCatalogs=[];
            for(var i=0; i<updates.Catalogs.length;i++){
              var temp = {};
              temp.ProductId=updated._id;
              temp.CatalogId=updates.Catalogs[i]._id;
              newFoodCatalogs.push(temp);
            }
            sqldb.FoodCatalogs.bulkCreate(newFoodCatalogs,{fields:['ProductId','CatalogId']})
              .error(function(err){
              console.log("error:",err);
            });
        }
      });
        return updated;
      });
  };
}

function saveCatalog(rowData){
  return function(entity){
   var newFoodCatalogs=[];
     for(var i=0; i<rowData.Catalogs.length;i++){
           var temp = {};
           temp.ProductId=entity._id;
           temp.CatalogId=rowData.Catalogs[i]._id;
           newFoodCatalogs.push(temp);
          }
          sqldb.FoodCatalogs.bulkCreate(newFoodCatalogs,{fields:['ProductId','CatalogId']})
          .then(function(foodCatalogs){
            return entity;
          })
          .error(function(err){
            console.log("error:",err);
          });
        return entity;
  }
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
   var newfilePath = 'client/assets/uploads/shop' + entity.shopid +'/'+ path.basename(file.path);
    console.log("newPath:",newfilePath);
    fs.rename(file.path,newfilePath,function(err){
      if (err) { 
        console.log("err:",err);
    }
    var oldfile='client/assets/uploads/shop'+entity.shopid+'/'+entity.picture;
    console.log("oldfile:",oldfile);
    fs.exists(oldfile,function(exists){
      if(exists){
        fs.unlink(oldfile,function(err){
          console.log("remove old file");
        })
      }
    });
    entity.picture = path.basename(file.path);
    return entity.save()
          .then(function(productSaved) {
            console.log("productSaved:",productSaved);
            res.status(201).json(productSaved);
          });
     })  
  }
}

// Gets a list of Products
exports.index = function(req, res) {
  
  sqldb.Product.findAll({
        where:{
          shopId:req.query['shopId']
        }
      }).then(responseWithResult(res))
        .catch(handleError(res));
    };
exports.catalog = function(req,res){
  console.log("query:",req.params.id);
  sqldb.Product.findById(req.params.id,{
    'include':[sqldb.Catalogs]
  }).then(responseWithResult(res))
    .catch(handleError(res));
    

};

// Gets a single Product from the DB
exports.show = function(req, res) {
  sqldb.Product.findById(req.params.id,{
    'include':[sqldb.Catalogs]
  }).then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
  };
  

// Creates a new Product in the DB
exports.create = function(req, res) {
  Product.create(req.body)
    .then(saveCatalog(req.body))
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
