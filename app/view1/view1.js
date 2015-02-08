'use strict';

function propertySearch(obj, search) {
  var ret = [];
  angular.forEach(obj, function(value){
    var find;
    if (find = value.properties[search]) {
      ret.push(find);
    }
  });
  return ret;
}

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])


.controller('View1Ctrl', function($scope, $interval) {

  $scope.time = 1;
  
  //Note: angular [forcefully removes natural sorting](https://github.com/angular/angular.js/issues/6210). 
  //Either [convert to array](http://ngmodules.org/modules/angular-toArrayFilter), or update to [angular 1.4](https://github.com/angular/angular.js/pull/10538)
  $scope.objects = [
    {
      id: 'person1',
      type: 'Person',
      name: "Smith",
      properties: {
        age: 18,
        health: 100,
        money: 100
      }
    },
    {
      id: 'shop1',
      type: 'Shop',
      name: "Restaurant",
      properties: {
        money: Infinity,
        food: Infinity
      }
    }

  ];

  $scope.rules = [
    {
      id: 'food',
      type: 'Rule',
      inputs: {
        money: 8
      },
      outputs: {
        food: 10
      }
    },
    {
      id: 'eat',
      type: 'Rule',
      inputs: {
        food: 1
      },
      outputs: {
        health: 0.8
      }
    }
  ];

  $scope.time_rules = [
    {
      id: 'Person.ageing',
      type: 'Rule_Time',
      adjustments: {
        age: 0.1, /*Object.age*/
        health: -0.1 /*person.health*/
      }
    }

  ];

  $scope.incrementTime = function(){
    $scope.time++;
    angular.forEach($scope.time_rules, function(value, key){
      angular.forEach(value.adjustments, function(value, key){
        console.log(key, value, propertySearch($scope.objects, key));
      });
    });
  };

  $scope.timer = null;
  $scope.speed = 1000;
  $scope.startStop = function(){
    console.log('startStop');
    if (!$scope.timer) {
      $scope.timer = $interval($scope.incrementTime, $scope.speed);
      $scope.status = 'Playing...';
    } else {
      $interval.cancel($scope.timer);
      $scope.timer = null;
      $scope.status = 'Paused';
    }
  }

  //Init
  // $scope.startStop(); //for some reason this calls twicE?
});