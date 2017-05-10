'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var catalogsCtrlStub = {
  index: 'catalogsCtrl.index',
  show: 'catalogsCtrl.show',
  create: 'catalogsCtrl.create',
  update: 'catalogsCtrl.update',
  destroy: 'catalogsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var catalogsIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './catalogs.controller': catalogsCtrlStub
});

describe('Catalogs API Router:', function() {

  it('should return an express router instance', function() {
    catalogsIndex.should.equal(routerStub);
  });

  describe('GET /api/catalogss', function() {

    it('should route to catalogs.controller.index', function() {
      routerStub.get
                .withArgs('/', 'catalogsCtrl.index')
                .should.have.been.calledOnce;
    });

  });

  describe('GET /api/catalogss/:id', function() {

    it('should route to catalogs.controller.show', function() {
      routerStub.get
                .withArgs('/:id', 'catalogsCtrl.show')
                .should.have.been.calledOnce;
    });

  });

  describe('POST /api/catalogss', function() {

    it('should route to catalogs.controller.create', function() {
      routerStub.post
                .withArgs('/', 'catalogsCtrl.create')
                .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/catalogss/:id', function() {

    it('should route to catalogs.controller.update', function() {
      routerStub.put
                .withArgs('/:id', 'catalogsCtrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/catalogss/:id', function() {

    it('should route to catalogs.controller.update', function() {
      routerStub.patch
                .withArgs('/:id', 'catalogsCtrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/catalogss/:id', function() {

    it('should route to catalogs.controller.destroy', function() {
      routerStub.delete
                .withArgs('/:id', 'catalogsCtrl.destroy')
                .should.have.been.calledOnce;
    });

  });

});
