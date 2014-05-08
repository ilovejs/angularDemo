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