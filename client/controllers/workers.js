var myApp = angular.module('myApp',[]);

myApp.controller('WorkersController', ['$scope', '$http', '$location', function ($scope, $http, $location, $routeParams) {

    $scope.getWorkers = function () {
        $http.get('/api/workers').success(function (response) {

            $scope.workers = response;

            $scope.data = $scope.workers;

            $scope.totalItems = $scope.data.length;


            $scope.numberOfPages = function() {
                return Math.ceil($scope.data.length / $scope.pageSize);
            }

            $scope.nextPage = function() {
                if ($scope.currentPage < $scope.numberOfPages()) {
                    return $scope.currentPage++;
                }
            }
            $scope.previousPage = function() {
                if ($scope.currentPage > 1) {
                    return $scope.currentPage--;
                }
            }
            $scope.currentPage = 1;
            $scope.pageSize = 5;
            $scope.filteredWorkers = [];

            $scope.$watch("currentPage + pageSize", function() {
                var begin = (($scope.currentPage - 1) * $scope.pageSize)
                    , end = begin + $scope.pageSize;

                $scope.filteredWorkers = $scope.workers.slice(begin, end);
            });

        });

    };

    $scope.getWorker = function (id) {
        console.log(id);
        $http.get('/api/workers/' + id).success(function (response) {
            $scope.worker = response;
        });
    };

    $scope.addWorker = function () {
        console.log($scope.worker);
        $http.post('/api/workers/', $scope.worker).success(function (response) {
            window.location.href = '#/workers';
            window.location.reload();
        });
    };

    $scope.updateWorker = function (id) {

        $http.put('/api/workers/' + id, $scope.worker).success(function (response) {
            window.location.href = '#/workers';
            window.location.reload();

        });
    };
    $scope.removeWorker = function (id) {
        $http.delete('/api/workers/' + id).success(function (response) {
            window.location.reload();
            $('#myModal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

        });
    };

    myApp.filter('startFrom', function() {

        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    });
}]);

