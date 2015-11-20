define(['exports', 'module', './../../../services/modal/modal-service', './enhanced-invoice-model', './../ewf-shipment-service', '../../../services/ewf-crud-service'], function (exports, module, _servicesModalModalService, _enhancedInvoiceModel, _ewfShipmentService, _servicesEwfCrudService) {
    'use strict';

    module.exports = EnhancedInvoiceAddressController;

    EnhancedInvoiceAddressController.$inject = ['$scope', '$timeout', 'modalService', 'enhancedInvoiceModel', 'ewfCrudService'];

    function EnhancedInvoiceAddressController($scope, $timeout, modalService, enhancedInvoiceModel, ewfCrudService) {
        var vm = this;

        var ACTION = {
            ADD: 'add',
            MODIFY: 'modify'
        };

        /**
        * At the moment it is not possible to save/update Contact
        * without sending "notifications" object.
        * But there is no possibility for User to setup notifications
        * from Enhanced Customs Invoice (and Address Details as well).
        *
        * TODO: Make it optional on BE side.
        * Jira task created to be implemented next Sprint: DHLEWFCON-10890.
        */
        var notifications = {
            emailNotifications: [{
                notificationEvents: {
                    clearedCustoms: false,
                    deliveryDelay: false,
                    pickedUpByCourier: false,
                    customsDelay: false,
                    delivered: false
                },
                destination: 'userSuccess@test.com',
                email: 'userSuccess@test.com',
                language: 'en',
                phoneCountryCode: '',
                type: 'EMAIL'
            }],
            smsNotifications: []
        };

        var modalWindow = undefined;
        var clear = true;

        Object.assign(vm, {
            showButtons: false,

            init: init,
            addressBookSelected: addressBookSelected,
            showSaveContactDialog: showSaveContactDialog,
            updateContact: updateContact,
            clearAddress: clearAddress,
            anyActionConfirmed: anyActionConfirmed
        });

        function init() {
            vm.invoice = enhancedInvoiceModel;
            $scope.saveContact = saveContact;
            $scope.$watch(function () {
                return vm.invoice.contactDetails;
            }, function () {
                vm.saveConfirmed = false;
                vm.updateConfirmed = false;
                if (clear) {
                    vm.showButtons = false;
                    $timeout(function () {
                        return clear = false;
                    });
                    return;
                }
                vm.showButtons = true;
            }, true);
        }

        function addressBookSelected(contact) {
            enhancedInvoiceModel.setContactDetails(contact);
        }

        function showSaveContactDialog() {
            modalWindow = modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                template: '<div ewf-modal><div class=\"row fw-bold\" nls=shipment.address_details_save_nickname></div><input type=text class=\"input input_width_full\" ng-model=nickname><div class=ewf-modal__footer><button type=button class=btn ng-click=\"saveContact(nickname, newContact, identifier)\" nls=shipment.address_details_save></button></div></div>'
            });
        }

        function saveContact(nickName) {
            vm.nickName = nickName;
            var contact = composeContact();
            sendContact(ACTION.ADD, contact);
        }

        function updateContact() {
            vm.nickName = vm.invoice.contactDetails.nickName;

            var contact = composeContact();
            contact.key = vm.invoice.contactDetails.addressDetails.key;

            sendContact(ACTION.MODIFY, contact);
        }

        function sendContact(action, contact) {
            ewfCrudService.addElement('/api/addressbook/contact/' + action, contact).then(function () {
                if (action === ACTION.ADD) {
                    vm.saveConfirmed = true;
                } else {
                    vm.updateConfirmed = true;
                }
            })['finally'](function () {
                modalWindow.close();
            });
        }

        function composeContact() {
            return {
                contactDetails: {
                    name: vm.invoice.contactDetails.name,
                    company: vm.invoice.contactDetails.company,
                    email: vm.invoice.contactDetails.email,
                    addressDetails: vm.invoice.contactDetails.addressDetails,
                    phoneDetails: vm.invoice.contactDetails.phone.phoneDetails,
                    nickname: vm.nickName
                },
                notifications: notifications
            };
        }

        function clearAddress() {
            clear = true;
            enhancedInvoiceModel.clearAddress();
        }

        function anyActionConfirmed() {
            return vm.updateConfirmed || vm.saveConfirmed;
        }
    }
});
//# sourceMappingURL=enhanced-invoice-address-controller.js.map
