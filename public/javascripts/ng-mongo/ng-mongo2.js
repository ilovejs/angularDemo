/**
 * Created by m.zhuang on 5/05/2014.
 */

var ngMongo = angular.module("ngMongo", []);

//factory return object, while services() return function
ngMongo.factory("Mongo", function($http){
    //inject http service to Mongo
    return{
        database: function(){
            return $http.get("/mongo-api/dbs");
        }
    }
});

ngMongo.controller("ListCtrl", function($scope, Mongo){
    //http get returns a promise....
    var result = Mongo.database();
    result.success(function(data){
        $scope.items = data;
    });
});

//mongo-api/dbs