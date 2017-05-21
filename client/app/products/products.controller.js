'use strict';

angular.module('foodApp')
  .controller('ProductsCtrl', function ($scope, $state,Product,socket,$http,Auth) {
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
            console.log("products:",products);
            socket.syncUpdates('product', $scope.products,function(event,product,products){
              console.log("event:",event);
              if(event=="deleted"){
                $scope.productsPages=[];
              for(var i=0;i<products.length;i+=9){
                $scope.productsPages.push(products.slice(i,i+9))
              }
                console.log("paged:",$scope.productsPages);
              }
            });
      });
    }) .catch(function(err) {
          err = err.data;
          $scope.errors = {};
          $state.go('main');
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('product');
    });
    $scope.deleteProduct = function(productid){
      Product.delete({id: productid}, function success(/* value, responseHeaders */) {
         // pageProducts($scope.products);
      }, errorHandler($scope));
    };

  })

  .controller('ProductCatalogCtrl', function ($scope, $stateParams, Product) {
    $scope.products = Product.catalog({id: $stateParams.slug});
    $scope.query = $stateParams.slug;
  })

  .controller('ProductViewCtrl', function ($scope, $state,Product, $stateParams, $http, Auth) {
    console.log("id:",$stateParams.id);
    $http.get('/api/products/' + $stateParams.id).success(function(product){
      console.log("product",product);
      $scope.product = product;
    });
    console.log("product:",$scope.product);
  
    $scope.user = Auth.getCurrentUser();
    $scope.deleteProduct = function(){
      Product.delete({id: $scope.product._id}, function success(/* value, responseHeaders */) {
        $state.go('products');
      }, errorHandler($scope));
    };
  })

  .controller('ProductNewCtrl', function ($scope, $state, Product,$http,socket,Upload,Auth, $timeout) {
    $scope.product = {}; // create a new instance

     Auth.getCurrentUser(function(user){
      $http({
        method:'GET',
        url:'/api/catalogs',
        params:{
          'shopId':user.Shops[0]._id
        }
      }).success(function(catalogs){
        $scope.catalogs = catalogs;
      for(var i=0;i<catalogs.length;i++)
      {
          $scope.catalogs[i].select=false;
      }
        socket.syncUpdates('catalogs', $scope.catalogs);
        
      }).error(function(err){
          console.log("err:",err);
      });
    });
     $scope.deleteCatalog = function(catalog) {
      $http.delete('/api/catalogs/' + catalog._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('catalogs');
    });

   $scope.addCatalog = function() {
    console.log("newCatalog:",$scope.newCatalog);
      if ($scope.newCatalog === '') {
        return;
      }
      Auth.getCurrentUser(function(user){
       
        $http.post('/api/catalogs', { name: $scope.newCatalog,shopId:user.Shops[0]._id });
        $scope.newCatalog = '';

    });
  };
    $scope.addProduct = function(){
      Auth.getCurrentUser(function(user){ var tempCatalogs=[];
      for(var i=0;i<$scope.catalogs.length;i++){
        if($scope.catalogs[i].select){
          delete $scope.catalogs[i].select;
          tempCatalogs.push($scope.catalogs[i]);
        }
      }
        $scope.product.Catalogs=tempCatalogs;

        $scope.product.shopid=user.Shops[0]._id;
        return Product.save($scope.product).$promise.then(function (product) {
          
          return Product.upload($scope.product.upPicture, product._id);
            }).then(function (product) {
              $state.go('viewProduct', {id: product._id});
              
            }).catch(errorHandler($scope));
        });
      };
  })

  .controller('ProductEditCtrl', function ($scope, $state, $stateParams,Product,socket,Auth,$http, Upload, $timeout) {  
    $http.get('/api/products/' + $stateParams.id).success(function(product){
      $scope.product = product;

      Auth.getCurrentUser(function(user){
      $http({
        method:'GET',
        url:'/api/catalogs',
        params:{
          'shopId':user.Shops[0]._id
        }
      }).success(function(catalogs){
        $scope.catalogs = catalogs;
      for(var i=0;i<catalogs.length;i++)
      {
          $scope.catalogs[i].select=false;
          for(var j=0;j<$scope.product.Catalogs.length;j++)
            if($scope.product.Catalogs[j]._id==catalogs[i]._id)
            {
                $scope.catalogs[i].select=true;
                break;
              } 
      }
        console.log("catalogs:",catalogs);
        socket.syncUpdates('catalogs', $scope.catalogs);

      }).error(function(err){
          console.log("err:",err);
      });
    });
  });

    $scope.deleteCatalog = function(catalog) {
      $http.delete('/api/catalogs/' + catalog._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('catalogs');
    });

   $scope.addCatalog = function() {
      console.log("newCatalog:",$scope.newCatalog);
      if ($scope.newCatalog === '') {
        return;
      }
      Auth.getCurrentUser(function(user){
      $http.post('/api/catalogs', { name: $scope.newCatalog,shopId:user.Shops[0]._id });
      $scope.newCatalog = '';

    });
  };
    $scope.action = function(){
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
