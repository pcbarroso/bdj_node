angular.module('bdjmain', [])
.controller('Game', function($scope, $http) {
    $scope.Games = [];
    $http.get('api/Game').
        then(function(response) {
            $scope.Games = response.data;
        });
});