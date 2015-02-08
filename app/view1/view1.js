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
        age: {value:18},
        health: {value:100 },
        money: {value:100},
        food: {value:0}
      }
    },
    {
      id: 'shop1',
      type: 'Shop',
      name: "Restaurant",
      properties: {
        money: {value:Infinity},
        food: {value:Infinity}
      }
    }

  ];

  $scope.rules = [
    {
      id: 'food1',
      type: 'Rule_Trade',
      inputs: {
        money: 8
      },
      outputs: {
        food: 10
      }
    },
    {
      id: 'eat',
      type: 'Rule_Transform',
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
      angular.forEach(value.adjustments, function(property_adjustment, property_name){
        var props = propertySearch($scope.objects, property_name);
        angular.forEach(props, function(property){
          property.value += property_adjustment;
          // console.log(property_name, property.value);
        });
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

  $scope.executeRule = function(rule, obj_input, obj_output){
    angular.forEach(rule.inputs, function(property_adjustment, property_name){     
      console.log(obj_input.id, 
        "gives", property_adjustment, property_name, 
        "to", obj_output.id);
      obj_input.properties[property_name].value -= property_adjustment;
      obj_output.properties[property_name].value += property_adjustment;
    });

    angular.forEach(rule.outputs, function(property_adjustment, property_name){
      console.log(obj_output.id, 
        "gives", property_adjustment, property_name, 
        "to", obj_input.id);
      obj_output.properties[property_name].value -= property_adjustment;
      obj_input.properties[property_name].value += property_adjustment;
    });
  };

  $scope.buyEat = function(){
    $scope.executeRule($scope.rules[0], $scope.objects[0], $scope.objects[1]);
    $scope.executeRule($scope.rules[1], $scope.objects[0], $scope.objects[0]);
    //... and here we realise there is a difference between trade and transform
  };

  //Init
  // $scope.startStop(); //for some reason this calls twicE?
});