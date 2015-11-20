import './../../../services/modal/modal-service';
import './enhanced-invoice-model';
import './../ewf-shipment-service';
import '../../../services/ewf-crud-service';

EnhancedInvoiceAddressController.$inject = ['$scope',
                                            '$timeout',
                                            'modalService',
                                            'enhancedInvoiceModel',
                                            'ewfCrudService'];

export default function EnhancedInvoiceAddressController($scope,
                                                         $timeout,
                                                         modalService,
                                                         enhancedInvoiceModel,
                                                         ewfCrudService) {
    const vm = this;

    const ACTION = {
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
    const notifications = {
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

    let modalWindow;
    let clear = true;


    Object.assign(vm, {
        showButtons: false,

        init,
        addressBookSelected,
        showSaveContactDialog,
        updateContact,
        clearAddress,
        anyActionConfirmed
    });


    function init() {
        vm.invoice = enhancedInvoiceModel;
        $scope.saveContact = saveContact;
        $scope.$watch(() => vm.invoice.contactDetails, () => {
            vm.saveConfirmed = false;
            vm.updateConfirmed = false;
            if (clear) {
                vm.showButtons = false;
                $timeout(() => clear = false);
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
            templateUrl: '../address-details/address-details-save-contact-dialog-layout.html'
        });
    }

    function saveContact(nickName) {
        vm.nickName = nickName;
        const contact = composeContact();
        sendContact(ACTION.ADD, contact);

    }

    function updateContact() {
        vm.nickName = vm.invoice.contactDetails.nickName;

        const contact = composeContact();
        contact.key = vm.invoice.contactDetails.addressDetails.key;

        sendContact(ACTION.MODIFY, contact);
    }

    function sendContact(action, contact) {
        ewfCrudService.addElement(`/api/addressbook/contact/${action}`, contact)
            .then(() => {
                if (action === ACTION.ADD) {
                    vm.saveConfirmed = true;
                } else {
                    vm.updateConfirmed = true;
                }
            })
            .finally(() => {
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
            notifications
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
