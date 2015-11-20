define(['exports', 'module', './want-to-share-service', './../../../../services/navigation-service', './../../../../services/modal/modal-service'], function (exports, module, _wantToShareService, _servicesNavigationService, _servicesModalModalService) {
    'use strict';

    module.exports = WantToShareController;

    WantToShareController.$inject = ['$scope', 'modalService', 'navigationService', 'wantToShareService'];

    function WantToShareController($scope, modalService, navigationService, wantToShareService) {
        var vm = this;

        vm.openShareDialog = openShareDialog;
        vm.shareDetails = shareDetails;

        var shipmentId = navigationService.getParamFromUrl('shipmentId');

        var modalWindow = undefined;

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

        wantToShareService.getShipmentShareDefaults(shipmentId).then(function (shareDefaults) {
            vm.shareDefaults = shareDefaults;
        });

        function openShareDialog() {
            wantToShareService.getShareFields(shipmentId).then(function (shareFields) {
                vm.sharingInfo = shareFields;
                if (angular.isArray(shareFields.toAddresses)) {
                    vm.sharingInfo.toAddresses = shareFields.toAddresses.join(', ');
                }

                modalWindow = modalService.showDialog({
                    closeOnEsc: true,
                    scope: $scope,
                    template: '<div ewf-modal nls-title=shipment.shipment_complete_share_shipping_details><div class=ewf-modal__body><form ewf-form id=formShareShippingDetails><div id=shareDetails><p nls=shipment.shipment_complete_share_separate_with_comma></p><div class=field-wrapper><label class=label nls=shipment.shipment_complete_share_to></label> <input type=text ng-model=wtsCtrl.sharingInfo.toAddresses name=to class=\"input input_width_full\" placeholder=name@email.com></div><div class=field-wrapper><label class=label nls=shipment.shipment_complete_share_from></label> <input type=text ng-model=wtsCtrl.sharingInfo.fromAddress name=from class=\"input input_width_full\" value=name@email.com></div><div class=field-wrapper><label class=label nls=shipment.shipment_complete_share_subject></label> <input type=text ng-model=wtsCtrl.sharingInfo.subject name=subject class=\"input input_width_full\" value=\"DHL EXPRESS Shipping Details\"></div><div class=field-wrapper><label class=label nls=shipment.shipment_complete_share_message></label> <textarea ng-model=wtsCtrl.sharingInfo.message nls=shipment.shipment_complete_share_message.placeholder name=message class=\"input input_width_full\">\r\n                    </textarea></div><h3 nls=shipment.shipment_complete_shipping_details></h3><table class=\"table table_zebra a-left full-width\"><tbody><tr ng-if=wtsCtrl.shareDefaults.trackingNumber><th nls=shipment.shipment_complete_share_tracking_number></th><td ng-bind=wtsCtrl.sharingInfo.details.trackingNumber></td></tr><tr ng-if=wtsCtrl.shareDefaults.pickupConfirmationNumber><th nls=shipment.shipment_complete_share_pickup_confirmation_number></th><td ng-bind=wtsCtrl.sharingInfo.details.pickupConfirmationNumber></td></tr><tr ng-if=wtsCtrl.shareDefaults.label><th nls=shipment.shipment_complete_share_waybill></th><td>Attachment</td></tr><tr ng-if=wtsCtrl.shareDefaults.customsInvoice><th nls=shipment.shipment_complete_share_customs_invoice></th><td>Attachment</td></tr><tr ng-if=wtsCtrl.shareDefaults.receipt><th nls=shipment.shipment_complete_share_receipt></th><td>Attachment</td></tr></tbody></table></div></form></div><footer class=ewf-modal__footer><button class=\"btn btn_success right\" data-ng-click=wtsCtrl.shareDetails(); nls=shipment.shipment_complete_share_details></button></footer></div>'
                });
            });
        }

        function shareDetails() {
            wantToShareService.shareDetails(shipmentId, vm.sharingInfo, vm.shareDefaults).then(function () {
                modalWindow.close();
            });
        }
    }
});
//# sourceMappingURL=want-to-share-controller.js.map
