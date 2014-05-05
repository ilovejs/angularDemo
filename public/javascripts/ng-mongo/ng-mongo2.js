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
    DB = $scope.items;
});

//mongo-api/dbs