
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
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {

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

myApp.controller('ModalInstanceCtrl', function ($uibModalInstance) {

    var $ctrl = this;

    $ctrl.ok = function () {
        $uibModalInstance.close();
    }; // submit button

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }; // cancel button

});

