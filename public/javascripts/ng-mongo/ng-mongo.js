/**
 * Created by m.zhuang on 5/05/2014.
 */
var MyCtrl = function($scope){
    $scope.items = [
        {name: "john", price: 100, lastDrank: '2013-01-01'},
        {name:"Jade", price: 120, lastDrank: '2013-02-01'}];

    $scope.pluralizer = {
        0: "No beers!",
        1: "Only one left!",
        other: "{} Beers in Fridge"
    };

    $scope.addBeer = function(){
        var b = {name: $scope.name, price: $scope.price, lastDrank: new Date()};
        $scope.items.push(b);
    };

    $scope.removeItem = function(item){
        if(confirm("Remove this beer - it's a good one!")) {
            var index = $scope.items.indexOf(item);
            console.log("index: " + index);
            $scope.items.splice(index, 1);
        }
    }
};

