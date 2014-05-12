/**
 * Created by m.zhuang on 5/05/2014.
 */
var Tekpub = Tekpub || {};

Tekpub.MongoApp = function(){
    var init = function(appName, payload){
        //init app
        app(appName, payload);
        //startup angular
        angular.element(document).ready(function(){
           angular.bootstrap(document, [appName]);
        });
    }

    var app = function(appName, payload){

        var ngMongo = angular.module(appName, ['ngResource']);
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

        ngMongo.config(function(MediaProvider){
            if(!payload) throw "Need to have mongoApi set please";
            for(var key in payload){
                //console.log("Setting " + key + " to " + api[key]);
                MediaProvider.setResource(key, payload[key]);
            }
        });

        //mongo provider
//        ngMongo.provider("Mongo", function(){
//            var connectionString = "";
//            this.setConnection = function(conn){
//                connectionString = conn;
//            };
//
//            this.$get = function($resource){
//                return {
//                    connection: connectionString,
//                    database : $resource("/mongo-api/dbs"),
//                    collection : $resource("/mongo-api/:database"),
//                    document : $resource("/mongo-api/:database/:collection")
//                }
//            };
//
//        });
//        ngMongo.config(function(MongoProvider){
//            MongoProvider.setConnection("some connection string");
//        });

        //naming convention is Carmle case
        ngMongo.directive("deleteButton", Tekpub.Bootstrap.DeleteButton);

        ngMongo.directive("addButton", Tekpub.Bootstrap.AddButton);

        ngMongo.directive("breadcrumbs", Tekpub.Bootstrap.BreadCrumbs);

        ngMongo.controller("DocumentCtrl", function($scope, $routeParams, Media){
            $scope.documents = Media.document.query($routeParams);

        });

        ngMongo .controller("ListCtrl", function($scope, $routeParams, $http, Media){
            //console.log(Mongo.connection);
            //extend scope with route on it k=database, v={{name}}
            var params = {
                database : $routeParams.database,
                collection: $routeParams.collection
            };

            //start with databases to list all
            var context = "root";
            //or picking up specific database
            if(params.database) context = "database";
            if(params.collection) context = "collection";

            $scope.items = Media[context].query(params);


            $scope.addItem = function(){
                var newItemName = $scope.newItemName;
                if(newItemName){
                    var newItem = new Media[context]({name: newItemName});
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

    }

    return {
        start: init
    }
}();

/*
* Pattern taken from : Egghead.io
* Egghead.io - AngularJS - YouTube by John Lindquist
* */
