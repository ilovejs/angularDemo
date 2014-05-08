/**
 * Created by m.zhuang on 7/05/2014.
 */
var Tekpub = Tekpub || {};
Tekpub.Bootstrap = {};

Tekpub.Bootstrap.AddButton = function(){
    return {
        restrict: "E",
        scope: {
            action: "&",
            text: "@"
        },
        //if just use explict function: addDb(), it won't work
        template: "<button class='btn btn-success' ng-click='action()'><i class='icon icon-white icon-plus-sign'></i>{{text}}</button>"
    };
};

Tekpub.Bootstrap.DeleteButton = function(){
    return{
        //element directives, A -> attribute, C -> class, also works for comments
        restrict: "E",
        replace: true,
        scope :{
            text: "@",
            action: "&",  //sth like lambda function
            comment: "="
        },
        template: "<button class='btn btn-danger' ng-click='action()'><i class='icon icon-remove icon-white'></i>{{text}}</button>"

    };
};

Tekpub.Bootstrap.BreadCrumbs = function($routeParams){
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
        template: '<div class="row">' +
            '<div class="span12">' +
            '<ol class="breadcrumb">' +
            '<li ng-repeat="crumb in crumbs">' +
            '<h3>' +
            '<a href="{{crumb.url}}">{{crumb.text}}</a>' +
            '<span class="divider" ng-show="notLast(crumb)"> / </span>' +
            '</h3>' +
            '</li>' +
            '</ol>' +
            '</div>' +
            '</div>'

    };
};