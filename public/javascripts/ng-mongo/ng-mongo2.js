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

ngMongo.controller("ListCtrl", function($scope, Mongo){
   $scope.items = Mongo.database.query({}, isArray = true);

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