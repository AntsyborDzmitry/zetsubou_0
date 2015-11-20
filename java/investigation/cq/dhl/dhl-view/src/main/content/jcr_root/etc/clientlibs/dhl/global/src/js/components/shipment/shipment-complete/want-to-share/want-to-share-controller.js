import './want-to-share-service';
import './../../../../services/navigation-service';
import './../../../../services/modal/modal-service';

WantToShareController.$inject = ['$scope', 'modalService', 'navigationService', 'wantToShareService'];

export default function WantToShareController($scope, modalService, navigationService, wantToShareService) {
    const vm = this;

    vm.openShareDialog = openShareDialog;
    vm.shareDetails = shareDetails;

    const shipmentId = navigationService.getParamFromUrl('shipmentId');

    let modalWindow;

    vm.shareDefaults = {
        trackingNumber: false,
        label: false,
        pickupConfirmationNumber: false,
        receipt: false,
        customsInvoice: false
    };

    vm.sharingInfo = {
        toAddresses: [],
        fromAddress: '',
        subject: '',
        message: '',
        details: {
            trackingNumber: null,
            pickupConfirmationNumber: null
        }
    };

    wantToShareService.getShipmentShareDefaults(shipmentId)
        .then((shareDefaults) => {
            vm.shareDefaults = shareDefaults;
        });

    function openShareDialog() {
        wantToShareService.getShareFields(shipmentId)
            .then((shareFields) => {
                vm.sharingInfo = shareFields;
                if (angular.isArray(shareFields.toAddresses)) {
                    vm.sharingInfo.toAddresses = shareFields.toAddresses.join(', ');
                }

                modalWindow = modalService.showDialog({
                    closeOnEsc: true,
                    scope: $scope,
                    templateUrl: 'share-shipping-details-dialog.html'
                });
            });

    }

    function shareDetails() {
        wantToShareService.shareDetails(shipmentId, vm.sharingInfo, vm.shareDefaults)
            .then(() => {
                modalWindow.close();
            });
    }

}
