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
var Shops = sqldb.Shops;

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

// Gets a list of Shopss
exports.index = function(req, res) {
  Shops.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Shops from the DB
exports.show = function(req, res) {
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
