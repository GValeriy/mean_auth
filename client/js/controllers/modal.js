
myApp.controller('ModalDemoCtrl', function ($uibModal, $log, $document) {
    console.log("ModalDemoCtrl loaded... ")

    var $ctrl = this;
    $ctrl.animationsEnabled = true;

    $ctrl.open = function (size, parentSelector) {

        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'WorkersController',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                items: function () {
                    return $ctrl.items;
                }
            }
        });

    };

    $ctrl.openComponentModal = function () {
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            component: 'modalComponent',
            resolve: {

            }
        });
    };

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

// myApp.controller('ModalInstanceCtrl', function ($uibModalInstance, myService) {
//
//
//     myService.getWorkers($scope.currentPage).success(function (response) {
//         $scope.itemsPerPage = response.limit;
//         $scope.totalItems = response.total;
//         $scope.currentPage = response.page;
//         $scope.workers = response.docs;
//     });
//
//
//
//     $ctrl.ok = function () {
//         $uibModalInstance.close($ctrl.selected.item);
//     }; // submit button
//
//     $ctrl.cancel = function () {
//         $uibModalInstance.dismiss('cancel');
//     }; // cancel button
//
// });

