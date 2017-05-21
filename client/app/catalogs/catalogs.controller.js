'use strict';

angular.module('foodApp')
  .controller('CatalogsCtrl', function($scope, $http,Auth, socket) {
    $scope.awesomeThings = [];

    Auth.getCurrentUser(function(user){
      $http({
        method:'GET',
        url:'/api/catalogs',
        params:{
          'shopId':user.Shops[0]._id
        }
      }).success(function(catalogs){
        $scope.awesomeThings = catalogs;
        socket.syncUpdates('catalogs', $scope.awesomeThings);
      });
    });
    $scope.addThing = function() {
      if ($scope.newThing === '') {
        return;
      }
      Auth.getCurrentUser(function(user){
      $http.post('/api/catalogs', { name: $scope.newThing,shopId:user.Shops[0]._id });
      $scope.newThing = '';
    });
  };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/catalogs/' + thing._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('catalogs');
    });
  });
