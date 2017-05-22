/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/shopss              ->  index
 * POST    /api/shopss              ->  create
 * GET     /api/shopss/:id          ->  show
 * PUT     /api/shopss/:id          ->  update
 * DELETE  /api/shopss/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var sqldb = require('../../sqldb');
var Shops = sqldb.Shop;
var userShop = sqldb.UserShop;
var path = require('path');
var fs = require('fs');
function handleError(res, statusCode) {
  console.log("handle error:",statusCode);
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
        return updated;
      });
  };
}

function associateUser(rowData){
  return function(entity){ 
      if(rowData.userId){
        userShop.create({userId:rowData.userId,shopId:entity._id,role:'admin'})
          .then(function(userShop){
            console.log("insert UserShop");
            return entity;
          })
          .error(function(err){
            console.log("error:",err);
            return entity;
          });
        return entity;
  }
  else
    return entity;
}
}

function initShopFolder(rowData){
  return function(entity){ 
      fs.mkdir("client/assets/uploads/shop"+entity._id,function(err){
        if(err){
          console.log("crete forder err:",err);
          return entity;
        }
      })
    return entity;
}
}

function saveFile(res, file) {
  return function(entity){
    //var newPath = '/assets/uploads/' + path.basename(file.path);
    var newfilePath='client/assets/uploads/shop'+entity._id+'/'+path.basename(file.path);
    console.log("newPath:",newfilePath);
    console.log("file.path:",file.path);
    fs.rename(file.path,newfilePath,function(err){
      if (err) { 
        console.log("err:",err);
        //handleError(res);
    }
    
    var oldfile='client/assets/uploads/shop'+entity._id+'/'+entity.img;
    console.log("oldfile:",oldfile);
    fs.exists(oldfile,function(exists){
      if(exists){
        fs.unlink(oldfile,function(err){
          console.log("remove old file");
        })
      }
    });
    entity.img = path.basename(file.path);
    return entity.save()
          .then(function(shopSaved) {
            console.log("shopSaved:",shopSaved);
            res.status(201).json(shopSaved);
          });
     })  
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

// Gets a list of Shopss
exports.index = function(req, res) {
  console.log("get shops");
  Shops.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Shops from the DB
exports.show = function(req, res) {
  console.log("get shop");
  Shops.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Shops in the DB
exports.create = function(req, res) {
  Shops.create(req.body)
    .then(initShopFolder(req.body))
    .then(associateUser(req.body))
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Shops in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Shops.find({
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

  Shops.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveFile(res, file))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Shops from the DB
exports.destroy = function(req, res) {
  Shops.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
