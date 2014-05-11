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

ngMongo.provider("Media", function(){
   //config
    var resources = [];
    this.setResource = function(resourceName, url){
        var resource = {name: resourceName, url: url};
        resources.push(resource);
    }
    //injected
    //building resources dynamically based on provider
    this.$get = function($resource){
        var result = {};
        _.each(resources, function(resource){
            //use resource constructor
            result[resource.name] = $resource(resource.url);
        });
        console.log(result);
        return result;
    }
});

//use constant 'MongoApiService'
ngMongo.config(function(MediaProvider){

    for(var key in MongoApiService){
        //console.log("Setting " + key + " to " + api[key]);
        MediaProvider.setResource(key, MongoApiService[key]);
    }
});

//service pattern
ngMongo.provider("Mongo", function(){
    var connectionString = "";
    this.setConnection = function(conn){
        connectionString = conn;
    };

    this.$get = function($resource){
        return {
            connection: connectionString,
            database : $resource("/mongo-api/dbs"),
            collection : $resource("/mongo-api/:database"),
            document : $resource("/mongo-api/:database/:collection")
        }
    };

});

//ngMongo.config(function(MongoProvider){
//    MongoProvider.setConnection("some connection string");
//});

//naming convention is Carmle case
ngMongo.directive("deleteButton", Tekpub.Bootstrap.DeleteButton);

ngMongo.directive("addButton", Tekpub.Bootstrap.AddButton);

ngMongo.directive("breadcrumbs", Tekpub.Bootstrap.BreadCrumbs);

ngMongo.controller("DocumentCtrl", function($scope, $routeParams, Mongo){
    $scope.documents = Mongo.document.query($routeParams);

});

ngMongo .controller("ListCtrl", function($scope, $routeParams, $http, Mongo, Media){
    //console.log(Mongo.connection);
    //extend scope with route on it k=database, v={{name}}
    var params = {
        database : $routeParams.database,
        collection: $routeParams.collection
    };

    //console.log($routeParams);

    /*** simple equivalent version ***/

    //start with databases to list all
    var context = "root";
    //or picking up specific database
    if(params.database) context = "database";
    if(params.collection) context = "collection";

    $scope.items = Media[context].query(params);
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