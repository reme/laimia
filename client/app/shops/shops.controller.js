'use strict';

angular.module('foodApp')
  .controller('ShopsCtrl', function ($scope,Shop,$http,socket,Auth) {
     $scope.maxSize = 10;     
    $scope.currentPage = 1;  
    $scope.shopsPages = []; 
    $scope.shops = [];
    
      $http.get('/api/shops/').success(function(shops){
        console.log("get success");
        $scope.totalItems = shops.length;
            for(var i=0;i<shops.length;i+=9){
                    $scope.shopsPages.push(shops.slice(i,i+9))
                }
            $scope.shops = shops;
            console.log("shops:",shops);
            socket.syncUpdates('shop', $scope.products,function(event,shop,shops){
              console.log("event:",event);
              if(event=="deleted"){
                $scope.shopsPages=[];
              for(var i=0;i<shops.length;i+=9){
                $scope.shopsPages.push(shops.slice(i,i+9))
              }
                console.log("paged:",$scope.shopsPages);
              }
            });
        })
      .error(function(err){
        console.log("err:",err);
      });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('shop');
    });
    $scope.deleteShop = function(shopid){
      Shop.delete({id: shopid}, function success(/* value, responseHeaders */) {
         // pageProducts($scope.products);
      }, errorHandler($scope));
    };

  })


 .controller('ShopNewCtrl', function ($scope, $state, Shop,$http,Upload,Auth, $timeout) {
    $scope.shop = {}; // create a new instance

     Auth.getCurrentUser(function(user){
      
      $scope.addShop = function(){
        Auth.getCurrentUser(function(user){ 
          $scope.shop.userId=user._id;
        
        return Shop.save($scope.shop).$promise.then(function (shop) {
          
          return Shop.upload($scope.shop.upPicture, shop._id);
            }).then(function (shop) {
              $state.go('viewShop', {id: shop._id});
              
            }).catch(errorHandler($scope));
        });
      };
  })
  })

   .controller('ShopViewCtrl', function ($scope, $state,$stateParams, $http, Auth) {
    console.log("id:",$stateParams.id);
    $http.get('/api/shops/' + $stateParams.id).success(function(shop){
      
      $scope.shop = shop;
    });
    console.log("shop:",$scope.shop);
  
    $scope.user = Auth.getCurrentUser();
    $scope.deleteShop = function(){
      Shop.delete({id: $scope.shop._id}, function success(/* value, responseHeaders */) {
        $state.go('shops');
      }, errorHandler($scope));
    };
  })

   .controller('ShopEditCtrl', function ($scope, $state, $stateParams,Shop,Auth,$http, Upload, $timeout) {  
    $http.get('/api/shops/' + $stateParams.id).success(function(shop){
      $scope.shop = shop;
     });

    $scope.editShop = function(){
    
      if($scope.shop.upPicture){ 
      return Shop.update({id: $scope.shop._id}, $scope.shop).$promise.then(function (shop) {
        
        return Shop.upload($scope.shop.upPicture, shop._id);
      }).then(function (shop) {
        $state.go('viewShop', {id: $scope.shop._id});
      }).catch(errorHandler($scope));
    } else {
        return Shop.update({id: $scope.shop._id}, $scope.shop).$promise.then(function(shop){
          $state.go('viewShop', {id: $scope.shop._id});
      }).catch(errorHandler($scope));
      };
    

    };

    $scope.upload = uploadHander($scope, Upload, $timeout);
  })



var errorHandler = function ($scope){
  return function error(httpResponse){
    console.log('failed: ', httpResponse);
    $scope.errors = httpResponse;
  };
};

var uploadHander = function ($scope, Upload, $timeout) {
  return function(file) {
    if (file && !file.$error) {
      $scope.file = file;
      file.upload = Upload.upload({
        url: '/api/shops/'+$scope.shop._id+'/upload',
        file: file
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0){
          console.log(response.status + ': ' + response.data);
          errorHandler($scope)(response.status + ': ' + response.data);
        }
      });

      file.upload.progress(function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }
  };
};


