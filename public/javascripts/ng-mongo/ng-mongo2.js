/**
 * Created by m.zhuang on 5/05/2014.
 */

var ngMongo = angular.module("ngMongo", ['ngResource']);

/*
* Pattern taken from : Egghead.io
* Egghead.io - AngularJS - YouTube by John Lindquist
* */
ngMongo.config(function($routeProvider){
    $routeProvider
        .when("/",{
            templateUrl: "list-template.html",
            controller: "ListCtrl"
        })
        .when("/:database", {
            templateUrl: "list-template.html",
            controller: "ListCtrl"
        });
});

//factory return object, while services() return function
ngMongo.factory("Mongo", function($resource){
    //inject http service to Mongo
    return {
        database: $resource("/mongo-api/dbs"),
        collection: $resource("/mongo-api/:database")
    }
});

//naming convention is Carmle case
ngMongo.directive("deleteButton", Tekpub.Bootstrap.DeleteButton);

ngMongo.directive("addButton", Tekpub.Bootstrap.AddButton);

ngMongo.controller("ListCtrl", function($scope, $routeParams, $http, Mongo){
    console.log($routeParams);

    /*** simple equivalent version ***/

    //start with databases to list all
    var context = "database";
    //or picking up specific database
    if($routeParams.database) context = "collection";

    $scope.items = Mongo[context].query($routeParams);
    /*** END ***/

    /*** verbose version
    if($routeParams.database){
        //fetch
        $scope.items = Mongo.collection.query({ database: $routeParams.database });  //isArray = true, default
    } else {
        $scope.items = Mongo.database.query();
    }
     ***/


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
       console.log(dbName);
   };

   $scope.removeDb = function(item){
        if(confirm("Remove database?")){
            item.$delete({name: item.name});
            $scope.items.splice($scope.items.indexOf(item),1);
        }
   };
});

//mongo-api/dbs