/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/catalogs              ->  index
 * POST    /api/catalogs              ->  create
 * GET     /api/catalogs/:id          ->  show
 * PUT     /api/catalogs/:id          ->  update
 * DELETE  /api/catalogs/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var sqldb = require('../../sqldb');
var Catalog = sqldb.Catalog;

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

// Gets a list of Catalogs
exports.index = function(req, res) {
  Catalog.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Catalog from the DB
exports.show = function(req, res) {
  Catalog.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Catalog in the DB
exports.create = function(req, res) {
  Catalog.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Catalog in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Catalog.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Catalog from the DB
exports.destroy = function(req, res) {
  Catalog.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
