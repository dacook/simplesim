'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope) {
  
  //Note: angular [forcefully removes natural sorting](https://github.com/angular/angular.js/issues/6210). 
  //Either [convert to array](http://ngmodules.org/modules/angular-toArrayFilter), or update to [angular 1.4](https://github.com/angular/angular.js/pull/10538)
  $scope.objects = [
    {
      id: 'person1',
      type: 'person',
      properties: {
        name: "Smith",
        age: 18,
        health: 100,
        money: 100
      }
    },
    {
      id: 'shop1',
      type: 'shop',
      properties: {
        name: "Restaurant",
        money: Infinity,
        food: Infinity
      }
    },

  ]

});