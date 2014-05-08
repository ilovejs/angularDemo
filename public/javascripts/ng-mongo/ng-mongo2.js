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
ngMongo.factory("Mongo", function($resource){
    //inject http service to Mongo
    return {
        database: $resource("/mongo-api/dbs"),
        collection: $resource("/mongo-api/:database"),
        document: $resource("/mongo-api/:database/:collection")
    }
});

//naming convention is Carmle case
ngMongo.directive("deleteButton", Tekpub.Bootstrap.DeleteButton);

ngMongo.directive("addButton", Tekpub.Bootstrap.AddButton);

ngMongo.directive("breadcrumbs", function($routeParams){
    return{
        restrict: "E",
        controller: function($scope){
            var rootUrl = "#/";
            //controller inside of directives
            $scope.crumbs = [{url: rootUrl, text: "Databases"}];

            var runningUrl = rootUrl;
            for(var param in $routeParams){
                //TODO: hasOwnProperty check, 2.console print does working for $routeParams or single items
                runningUrl += $routeParams[param];
                $scope.crumbs.push({url: runningUrl, text: $routeParams[param]});
            }
//            console.log("rp: ");
//            console.log($routeParams);
//            console.log("end rp");
            $scope.notLast = function(crumb){
                //console.log($scope.crumbs);
//                return false;
                return  (crumb !== _.last($scope.crumbs));
            }
        },
        templateUrl: "breadcrumb-template.html"

    };

});

ngMongo.controller("DocumentCtrl", function($scope, $routeParams, Mongo){
    $scope.documents = Mongo.document.query($routeParams);

});

ngMongo.controller("ListCtrl", function($scope, $routeParams, $http, Mongo){
    //extend scope with route on it k=database, v={{name}}

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

   $scope.addItem = function(){
       var newItemName = $scope.newItemName;
       if(newItemName){
           var newItem = new Mongo[context]({name: newItemName});
           //if adding 'collection' that belongs to database, make sure POST to '/mongo-api/:database'
           //creating new db POST to '/mongo-api/dbs'
           newItem.$save($routeParams); //use http POST
           $scope.items.push(newItem); //check node console info to make sure it is POST
       }
   };

   $scope.removeItem = function(item){
        if(confirm("Delete this " + context + " ? There's no undo...")){
            var params = {name: item.name};
            if($routeParams.database) params.database = $routeParams.database;

            item.$delete(params);
            $scope.items.splice($scope.items.indexOf(item),1);
        }
   };
});

//mongo-api/dbs