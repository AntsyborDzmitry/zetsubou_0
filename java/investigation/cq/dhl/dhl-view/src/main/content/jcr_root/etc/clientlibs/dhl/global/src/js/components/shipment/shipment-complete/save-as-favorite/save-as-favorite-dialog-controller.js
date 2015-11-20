import './save-as-favorite-service';

SaveAsFavoriteDialogController.$inject = ['$scope', 'navigationService', 'saveAsFavoriteService'];

export default function SaveAsFavoriteDialogController($scope, navigationService, saveAsFavoriteService) {
    const vm = this;

    const shipmentId = navigationService.getParamFromUrl('shipmentId');

    Object.assign(vm, {
        saveAsFavorite,

        shipmentName: null
    });

    function saveAsFavorite(form, ewfFormCtrl) {
        if (form.$invalid && ewfFormCtrl.ewfValidation()) {
            return;
        }
        saveAsFavoriteService.saveAsFavorite(shipmentId, vm.shipmentName)
            .then(() => {
                $scope.ewfModalCtrl.close();
            })
            .catch((reason) => {
                vm.errors = reason.errors;
            });
    }
}
