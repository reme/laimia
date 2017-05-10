'use strict';

angular.module('foodApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('shops', {
        url: '/shops',
        templateUrl: 'app/shops/shops.html',
        controller: 'ShopsCtrl'
      });
  });
