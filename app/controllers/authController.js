app.controller('authController', function authController( userFactory, $scope) {
    console.log("authController loaded");
    'use strict';
    // var authCtrl = this;
    $scope.worker = null;

    $scope.login= function (username, password) {
        userFactory.login(username, password).then(function success(response) {
            $scope.user = response.data.user;
            userFactory.getUser().then(function success(response) {
                $scope.worker = response.data;
                console.log('asdasd',$scope.worker,response);
            });
        }, handleError);
    };

    $scope.logout= function () {
        userFactory.logout();
        $scope.user = null;
    };

    function handleError(response) {
        alert('Error: ' + response.data);
    };

});
