/**
 * Created by m.zhuang on 5/05/2014.
 */

var ngMongo = angular.module("ngMongo", ['ngResource']);

//factory return object, while services() return function
ngMongo.factory("Mongo", function($resource){
    //inject http service to Mongo
    return {
        database: $resource("/mongo-api/dbs")
    }
});

//naming convention is Carmle case
ngMongo.directive("deleteButton", function(){
    return{
        //element directives, A -> attribute, C -> class, also works for comments
        restrict: "E",
        replace: true,
        scope :{
            text: "@",
            action: "&"
        },
        template: "<button class='btn btn-danger' ng-click='action()'><i class='icon icon-remove icon-white'></i>{{text}}</button>"

    };
});

ngMongo.controller("ListCtrl", function($scope, $http, Mongo){
    $scope.items = Mongo.database.query({}, isArray = true);
//   var result = $http.get("/mongo-api/dbs");
//   result.success(function(data){
//       $scope.items = data;
//   });

   $scope.addDb = function(){
       var dbName = $scope.newDbName;
       if(dbName){
           var newDb = new Mongo.database({name: dbName});
           newDb.$save(); //use http POST
           $scope.items.push(newDb); //check node console info to make sure it is POST
       }
   };

   $scope.removeDb = function(item){
        if(confirm("Remove database?")){
            item.$delete({name: item.name});
            $scope.items.splice($scope.items.indexOf(item),1);
        }
   };
});

//mongo-api/dbs