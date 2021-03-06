'use strict';

var express = require('express');
var controller = require('./product.controller');

var router = express.Router();
var uploadOptions = {
	autoFile:true,
	uploadDir:'client/assets/uploads/'
}
var multiparty = require('connect-multiparty');
router.post('/:id/upload',multiparty(uploadOptions),controller.upload);
router.get('/', controller.index);
router.get('/:id/catalog',controller.catalog);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
