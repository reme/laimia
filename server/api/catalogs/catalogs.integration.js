'use strict';

var app = require('../../app');
var request = require('supertest');

var newCatalogs;

describe('Catalogs API:', function() {

  describe('GET /api/catalogss', function() {
    var catalogss;

    beforeEach(function(done) {
      request(app)
        .get('/api/catalogss')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          catalogss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      catalogss.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/catalogss', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/catalogss')
        .send({
          name: 'New Catalogs',
          info: 'This is the brand new catalogs!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newCatalogs = res.body;
          done();
        });
    });

    it('should respond with the newly created catalogs', function() {
      newCatalogs.name.should.equal('New Catalogs');
      newCatalogs.info.should.equal('This is the brand new catalogs!!!');
    });

  });

  describe('GET /api/catalogss/:id', function() {
    var catalogs;

    beforeEach(function(done) {
      request(app)
        .get('/api/catalogss/' + newCatalogs._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          catalogs = res.body;
          done();
        });
    });

    afterEach(function() {
      catalogs = {};
    });

    it('should respond with the requested catalogs', function() {
      catalogs.name.should.equal('New Catalogs');
      catalogs.info.should.equal('This is the brand new catalogs!!!');
    });

  });

  describe('PUT /api/catalogss/:id', function() {
    var updatedCatalogs

    beforeEach(function(done) {
      request(app)
        .put('/api/catalogss/' + newCatalogs._id)
        .send({
          name: 'Updated Catalogs',
          info: 'This is the updated catalogs!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedCatalogs = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCatalogs = {};
    });

    it('should respond with the updated catalogs', function() {
      updatedCatalogs.name.should.equal('Updated Catalogs');
      updatedCatalogs.info.should.equal('This is the updated catalogs!!!');
    });

  });

  describe('DELETE /api/catalogss/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/catalogss/' + newCatalogs._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when catalogs does not exist', function(done) {
      request(app)
        .delete('/api/catalogss/' + newCatalogs._id)
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
