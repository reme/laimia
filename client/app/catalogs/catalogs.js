'use strict';

angular.module('foodApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('catalogs', {
        url: '/catalogs',
        templateUrl: 'app/catalogs/catalogs.html',
        controller: 'CatalogsCtrl'
      });
  });
