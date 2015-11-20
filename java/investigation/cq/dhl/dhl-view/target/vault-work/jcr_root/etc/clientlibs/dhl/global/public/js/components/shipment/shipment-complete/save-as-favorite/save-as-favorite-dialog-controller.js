define(['exports', 'module', './save-as-favorite-service'], function (exports, module, _saveAsFavoriteService) {
    'use strict';

    module.exports = SaveAsFavoriteDialogController;

    SaveAsFavoriteDialogController.$inject = ['$scope', 'navigationService', 'saveAsFavoriteService'];

    function SaveAsFavoriteDialogController($scope, navigationService, saveAsFavoriteService) {
        var vm = this;

        var shipmentId = navigationService.getParamFromUrl('shipmentId');

        Object.assign(vm, {
            saveAsFavorite: saveAsFavorite,

            shipmentName: null
        });

        function saveAsFavorite(form, ewfFormCtrl) {
            if (form.$invalid && ewfFormCtrl.ewfValidation()) {
                return;
            }
            saveAsFavoriteService.saveAsFavorite(shipmentId, vm.shipmentName).then(function () {
                $scope.ewfModalCtrl.close();
            })['catch'](function (reason) {
                vm.errors = reason.errors;
            });
        }
    }
});
//# sourceMappingURL=save-as-favorite-dialog-controller.js.map
