'use strict';

describe('Controller: ShopsCtrl', function () {

  // load the controller's module
  beforeEach(module('foodApp'));

  var ShopsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShopsCtrl = $controller('ShopsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
