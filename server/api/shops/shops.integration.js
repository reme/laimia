'use strict';

var app = require('../../app');
var request = require('supertest');

var newShops;

describe('Shops API:', function() {

  describe('GET /api/shopss', function() {
    var shopss;

    beforeEach(function(done) {
      request(app)
        .get('/api/shopss')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          shopss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      shopss.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/shopss', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/shopss')
        .send({
          name: 'New Shops',
          info: 'This is the brand new shops!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newShops = res.body;
          done();
        });
    });

    it('should respond with the newly created shops', function() {
      newShops.name.should.equal('New Shops');
      newShops.info.should.equal('This is the brand new shops!!!');
    });

  });

  describe('GET /api/shopss/:id', function() {
    var shops;

    beforeEach(function(done) {
      request(app)
        .get('/api/shopss/' + newShops._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          shops = res.body;
          done();
        });
    });

    afterEach(function() {
      shops = {};
    });

    it('should respond with the requested shops', function() {
      shops.name.should.equal('New Shops');
      shops.info.should.equal('This is the brand new shops!!!');
    });

  });

  describe('PUT /api/shopss/:id', function() {
    var updatedShops

    beforeEach(function(done) {
      request(app)
        .put('/api/shopss/' + newShops._id)
        .send({
          name: 'Updated Shops',
          info: 'This is the updated shops!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedShops = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedShops = {};
    });

    it('should respond with the updated shops', function() {
      updatedShops.name.should.equal('Updated Shops');
      updatedShops.info.should.equal('This is the updated shops!!!');
    });

  });

  describe('DELETE /api/shopss/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/shopss/' + newShops._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when shops does not exist', function(done) {
      request(app)
        .delete('/api/shopss/' + newShops._id)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
