'use strict';

angular.module('foodApp')
  .controller('ProductsCtrl', function ($scope, $http,Auth) {
    $scope.maxSize = 10;     
    $scope.currentPage = 1;  
    $scope.productsPages = []; 
    $scope.products = [];
    Auth.getCurrentUser(function(user){
      console.log("user:",user);
      $http({
        method:'GET',
        url:'/api/products',
        params:{
          'shopId':user.Shops[0]._id
        }
      }).success(function(products){
        $scope.totalItems = products.length;
            for(var i=0;i<products.length;i+=9){
                    $scope.productsPages.push(products.slice(i,i+9))
                }
            $scope.products = products;
      });
    }) .catch(function(err) {
          err = err.data;
          $scope.errors = {};
          $state.go('main');
    });
  })
    /*var currentUser = '';
    Auth.getCurrentUser(function(user){
      currentUser = user.name;
      console.log("user:",user.name);
    //$http.get('/api/products')
      $http({
        method:'GET',
        url:'/api/products',
        params:{
              'user':currentUser
          }
        }).success(function(products) {
            $scope.totalItems = products.length;
            for(var i=0;i<products.length;i+=9){
                    $scope.productsPages.push(products.slice(i,i+9))
                }

            $scope.products = products;
      });   
    }) .catch(function(err) {
          err = err.data;
          $scope.errors = {};
          $state.go('main');
    });
  })
  */
  .controller('ProductCatalogCtrl', function ($scope, $stateParams, Product) {
    $scope.products = Product.catalog({id: $stateParams.slug});
    $scope.query = $stateParams.slug;
  })

  .controller('ProductViewCtrl', function ($scope, $state, $stateParams, $http, Auth) {
    console.log("id:",$stateParams.id);
    $http.get('/api/products/' + $stateParams.id).success(function(product){
      console.log("product",product);
      $scope.product = product;
    });
    
  
    $scope.user = Auth.getCurrentUser();
    $scope.deleteProduct = function(){
      Product.delete({id: $scope.product._id}, function success(/* value, responseHeaders */) {
        $state.go('products');
      }, errorHandler($scope));
    };
  })

  .controller('ProductNewCtrl', function ($scope, $state, Product) {
    $scope.product = {}; // create a new instance
    $scope.addProduct = function(){
      return Product.save($scope.product).$promise.then(function (product) {
        return Product.upload($scope.product.picture, product._id);
      }).then(function (product) {
        $state.go('viewProduct', {id: product._id});
      }).catch(errorHandler($scope));
    };
  })

  .controller('ProductEditCtrl', function ($scope, $state, $stateParams,Product, $http, Upload, $timeout) {  
    $http.get('/api/products/' + $stateParams.id).success(function(product){
      $scope.product = product;
      console.log("scope.product:",$scope.product);
      $http.get('/api/catalogs/').success(function(catalog) {
      $scope.catalogs = catalog;
      for(var i=0;i<catalog.length;i++)
      {
          $scope.catalogs[i].select=false;
          for(var j=0;j<$scope.product.Catalogs.length;j++)
            if($scope.product.Catalogs[j]._id==catalog[i]._id){
                $scope.catalogs[i].select=true;
                break;
              } 
      }
        console.log("catalogs:",catalog);

      }).error(function(err){
          console.log("err:",err);
      });
    });
     $scope.updateSelection = function($event,id){  
      /*  var checkbox = $event.target ;  
        var checked = checkbox.checked ;  
        if(checked){  
            $scope.selected.push(id) ;  
        }else{  
            var idx = $scope.selected.indexOf(id) ;  
            $scope.selected.splice(idx,1) ;  
        }*/  
    }; 
    $scope.editProduct = function(){
      var tempCatalogs=[];
      for(var i=0;i<$scope.catalogs.length;i++){
        if($scope.catalogs[i].select){
          delete $scope.catalogs[i].select;
          tempCatalogs.push($scope.catalogs[i]);
        }
      }
      $scope.product.Catalogs=tempCatalogs;
      if($scope.product.upPicture){ 
      return Product.update({id: $scope.product._id}, $scope.product).$promise.then(function (product) {
        return Product.upload($scope.product.upPicture, product._id);
      }).then(function (product) {
        $state.go('viewProduct', {id: $scope.product._id});
      }).catch(errorHandler($scope));
    } else {
        return Product.update({id: $scope.product._id}, $scope.product).$promise.then(function(product){
          $state.go('viewProduct', {id: $scope.product._id});
      }).catch(errorHandler($scope));
      };
    

    };

    $scope.upload = uploadHander($scope, Upload, $timeout);
  })

  .constant('clientTokenPath', '/api/braintree/client_token')

  .controller('ProductCheckoutCtrl',
    function($scope, $http, $state, ngCart){
    $scope.errors = '';

    $scope.paymentOptions = {
      onPaymentMethodReceived: function(payload) {
        angular.merge(payload, ngCart.toObject());
        payload.total = payload.totalCost;
        $http.post('/api/orders', payload)
        .then(function success () {
          ngCart.empty(true);
          $state.go('products');
        }, function error (res) {
          $scope.errors = res;
        });
      }
    };
  });

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
        url: '/api/products/'+$scope.product._id+'/upload',
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
