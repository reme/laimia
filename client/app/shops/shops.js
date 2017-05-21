'use strict';

angular.module('foodApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('shops', {
        url: '/shops',
        templateUrl: 'app/shops/shops.html',
        controller: 'ShopsCtrl'
      })
      .state('newShop', {
        url: '/shops/new',
        templateUrl: 'app/shops/templates/shop-new.html',
        controller: 'ShopNewCtrl',
        authenticate: 'admin'
      })

      .state('viewShop', {
        url: '/shops/:id/view',
        templateUrl: 'app/shops/templates/shop-view.html',
        controller: 'ShopViewCtrl'
      })

      .state('editShop', {
        url: '/shops/:id/edit',
        templateUrl: 'app/shops/templates/shop-edit.html',
        controller: 'ShopEditCtrl',
      })
  });
