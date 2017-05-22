'use strict';

angular.module('foodApp')
  .controller('NavbarCtrl', function ($scope, Auth) {
    $scope.menu = [{
      'title': '主页',
      'state': 'main',
      'icon': 'glyphicon-home',
      'login':false
    }, {
      'title': '菜单',
      'state': 'products',
      'icon': 'glyphicon-book',
      'login':true
    }];
    
    $scope.items = [{
      'title': '修改密码',
      'state': 'settings',
      'icon': 'glyphicon-wrench',
      'login':true
    }, {
      'title': '店铺设置',
      'state': 'editShop({id: getCurrentUser().Shops[0]._id})',
      'icon': 'glyphicon-th',
      'login':true
    },{
      'title': '房间管理',
      'state': 'room',
      'icon': 'glyphicon-th',
      'login':true
    }];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
  });
