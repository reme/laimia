'use strict';

describe('Controller: CatalogsCtrl', function () {

  // load the controller's module
  beforeEach(module('foodApp'));

  var CatalogsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CatalogsCtrl = $controller('CatalogsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
