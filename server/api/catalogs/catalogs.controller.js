/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/catalogss              ->  index
 * POST    /api/catalogss              ->  create
 * GET     /api/catalogss/:id          ->  show
 * PUT     /api/catalogss/:id          ->  update
 * DELETE  /api/catalogss/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var py = require('pinyin');
var sqldb = require('../../sqldb');
var Catalogs = sqldb.Catalogs;

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

// Gets a list of Catalogss
exports.index = function(req, res) {
  Catalogs.findAll({
        where:{
          shopId:req.query['shopId']
        }
      })
    .then(responseWithResult(res))
    .catch(handleError(res));
};
// Gets a single Catalogs from the DB
exports.show = function(req, res) {
  Catalogs.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Catalogs in the DB
exports.create = function(req, res) {
  console.log("body:",req.body);
  var data=req.body;
  var classid = py(data.name,{style:py.STYLE_NORMAL,heteronym:false}).join('');
  data.classid=classid;
  Catalogs.create(data)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Catalogs in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Catalogs.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Catalogs from the DB
exports.destroy = function(req, res) {
  Catalogs.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
