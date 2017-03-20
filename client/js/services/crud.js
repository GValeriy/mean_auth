myApp.service('myService', ['$http', function ($http) {

    this.getWorker = function (id) {
        var getWorker = $http.get("/api/workers/" + id);
        return getWorker;
    };

    this.addWorker = function (worker) {
        var addWorker = $http.post('/api/workers/', worker);
        return addWorker;
    }

    this.getWorkers = function (page) {
     var getWorkers = $http.get("/api/workers", {
         params: {
             page: page
         }
     });
     return getWorkers;
    };

    this.removeWorker = function (id) {
        var removeWorker=$http.delete('/api/workers/' + id);
      return  removeWorker;
    };

}]);