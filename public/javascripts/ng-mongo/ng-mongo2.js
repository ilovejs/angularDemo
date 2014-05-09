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
        })
        .when("/:database/:collection", {
            templateUrl: "document-template.html",
            controller: "DocumentCtrl"
        })
        .otherwise({
            template: "<h1>Not Found</h1>"
        });
});

//factory return object, while services() return function
//use revealing pattern, console.log(this) return back a Constructor
//ngMongo.factory("Mongo", function($resource){
//    //inject http service to Mongo
//    return {
//        database: $resource("/mongo-api/dbs"),
//        collection: $resource("/mongo-api/:database"),
//        document: $resource("/mongo-api/:database/:collection")
//    }
//});

//service pattern
ngMongo.service("Mongo", function($resource){
    this.database = $resource("/mongo-api/dbs");
    this.collection = $resource("/mongo-api/:database");
    this.document = $resource("/mongo-api/:database/:collection");
});

//naming convention is Carmle case
ngMongo.directive("deleteButton", Tekpub.Bootstrap.DeleteButton);

ngMongo.directive("addButton", Tekpub.Bootstrap.AddButton);

ngMongo.directive("breadcrumbs", Tekpub.Bootstrap.BreadCrumbs);

ngMongo.controller("DocumentCtrl", function($scope, $routeParams, Mongo){
    $scope.documents = Mongo.document.query($routeParams);

});

ngMongo .controller("ListCtrl", function($scope, $routeParams, $http, Mongo){
    //extend scope with route on it k=database, v={{name}}
    var params = {
        database : $routeParams.database,
        collection: $routeParams.collection
    };

    console.log($routeParams);

    /*** simple equivalent version ***/

    //start with databases to list all
    var context = "database";
    //or picking up specific database
    if(params.database) context = "collection";

    $scope.items = Mongo[context].query(params);
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

   $scope.addItem = function(){
       var newItemName = $scope.newItemName;
       if(newItemName){
           var newItem = new Mongo[context]({name: newItemName});
           //if adding 'collection' that belongs to database, make sure POST to '/mongo-api/:database'
           //creating new db POST to '/mongo-api/dbs'
           newItem.$save(params); //use http POST
           $scope.items.push(newItem); //check node console info to make sure it is POST
       }
   };

   $scope.removeItem = function(item){
        if(confirm("Delete this " + context + " ? There's no undo...")){
            var removeParams = {name: item.name};
            if(params.database) removeParams.database = params.database;

            item.$delete(removeParams);
            $scope.items.splice($scope.items.indexOf(item),1);
        }
   };
});

//mongo-api/dbs