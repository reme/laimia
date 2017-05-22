'use strict';

angular.module('foodApp')
  .controller('MainCtrl', function($scope, $http, socket) {
     $scope.myInterval = 5000;
     $scope.position=0;
      var slides = $scope.slides = [];
      slides.push({ image: '/assets/images/back.png', text: '好吃好卖，好管理！！' });
      slides.push({ image: '/assets/images/shangcai.png', text: '来点菜吧后台管理' });
    $scope.awesomeThings = [];
    console.log("main:");
    $http.get('/api/things').success(function(awesomeThings) {
      console.log("thins:",awesomeThings);
      $scope.allThings = awesomeThings;
      $scope.awesomeThings = $scope.allThings.slice(0,4);
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.morFeatures = function(){
      $scope.position++;
      var l = $scope.allThings.length
      var end = 0;
      if($scope.position*4+4>l)
      {
        end=l-1;
      }
      else
      {
        end = $scope.position*4+4;
      }
      $scope.awesomeThings = $scope.allThings.slice(0,end);
    }

    $scope.addThing = function() {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  });
