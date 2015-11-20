define(['exports', 'module', './../../services/ewf-crud-service', './../../services/modal/modal-service', './../../constants/system-settings-constants'], function (exports, module, _servicesEwfCrudService, _servicesModalModalService, _constantsSystemSettingsConstants) {
    'use strict';

    module.exports = ShipmentReferenceController;

    ShipmentReferenceController.$inject = ['$scope', '$timeout', 'ewfCrudService', 'modalService', 'systemSettings'];

    function ShipmentReferenceController($scope, $timeout, ewfCrudService, modalService, systemSettings) {

        var modalDialog = undefined;
        var currentAction = undefined;
        var gridActionStatus = {};
        var defaultGridStatus = {
            created: false,
            updated: false,
            deleted: false,
            rejected: false
        };
        var vm = this;
        var shipmentReferencesUrl = '/api/myprofile/shipment/references';
        var shipmentReferenceDefaultsUrl = '/api/myprofile/shipment/defaults/references';
        var updateReferenceLabelUrl = '/api/myprofile/shipment/defaults/references/label';
        var bulkElementsMsgCode = 'shipment-settings.ship_ref__delete_elements_confirmation_message';
        var modalErrorMsgCode = 'shipment-settings.ship_ref__nfn_shr__mdl_error_message';
        var actions = {
            add: {
                title: 'shipment-settings.ship_ref__mdl_add_dlg_title',
                label: 'shipment-settings.ship_ref__mdl_add_dlg_label',
                method: addReference
            },
            edit: {
                title: 'shipment-settings.ship_ref__mdl_edit_dlg_title',
                label: 'shipment-settings.ship_ref__mdl_edit_dlg_label',
                method: updateReference
            }
        };

        Object.assign(vm, {
            connected: false,
            labelUpdated: false,
            defaultReferenceChanged: false,
            showEditDefaults: false,
            selectedDefault: {},
            defaultReference: {},
            gridData: [],
            referenceDefaults: {},
            columnsToDisplay: [{
                alias: 'name',
                title: 'shipment-settings.ship_ref__nickname'
            }],
            gridActionStatus: gridActionStatus,
            currentAction: currentAction,
            modalDialog: modalDialog,
            successHandler: successHandler,
            runAddDialog: runAddDialog,
            runEditDialog: runEditDialog,
            isAddAction: isAddAction,
            proceedAction: proceedAction,
            addReference: addReference,
            updateReference: updateReference,
            onReferenceNameChange: onReferenceNameChange,
            init: init,
            bulkDeleteElements: bulkDeleteElements,
            notificationData: '',
            setDefaultReference: setDefaultReference,
            updateReferenceLabel: updateReferenceLabel,
            toggleEditDefaults: toggleEditDefaults,
            changeWithTimeout: changeWithTimeout,
            getShipmentReferenceList: getShipmentReferenceList,
            getShipmentDefault: getShipmentDefault,
            gridDataWatcher: gridDataWatcher
        });

        function init() {
            vm.getShipmentReferenceList();
            vm.getShipmentDefault();
            vm.gridCtrl.editCallback = runEditDialog;
        }

        function getShipmentReferenceList() {
            ewfCrudService.getElementList(shipmentReferencesUrl).then(function (referencesList) {
                vm.connected = true;
                vm.gridData = referencesList;
                $scope.$watch('shipmentReferenceCtrl.gridData.length', vm.gridDataWatcher);
                vm.gridCtrl.rebuildGrid(vm.gridData);
            });
        }

        function bulkDeleteElements() {
            vm.gridCtrl.bulkDeleteElements(bulkElementsMsgCode);
        }

        function runDialog() {
            vm.modalDialog = modalService.showDialog({
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                template: '<script>\r\n    document.createElement(\'ewf-form\');\r\n    document.createElement(\'ewf-field\');\r\n    dhl.registerComponent(\'directives/ewf-form/ewf-form-directive\');\r\n    dhl.registerComponent(\'directives/ewf-input/ewf-input-controller\');\r\n    dhl.registerComponent(\'directives/ewf-validate/ewf-validate-pattern-directive\');\r\n    dhl.registerComponent(\'directives/ewf-validate/ewf-validate-required-directive\');\r\n    dhl.registerComponent(\'directives/ewf-click/ewf-click-directive\');\r\n</script><ewf-modal><div class=\"modal invisible\" id=shipment_reference_modal><form name=shipmentReferenceForm ewf-form=shipmentReferenceForm><h3 nls={{shipmentReferenceCtrl.currentAction.title}}></h3><div class=field-wrapper ewf-field=nickName><label class=label for=reference_nickname nls={{shipmentReferenceCtrl.currentAction.label}}></label> <input id=reference_nickname class=\"input input_width_full\" type=text ng-model=shipmentReferenceCtrl.referenceNickname ng-change=shipmentReferenceCtrl.onReferenceNameChange() ewf-input=shipmentReferenceForm.nickName ewf-validate-required> <span class=validation-mark></span><div ewf-field-errors></div><div class=\"label-error ng-scope\" ng-if=shipmentReferenceCtrl.referenceValidationError nls={{shipmentReferenceCtrl.referenceValidationError}}></div></div><label class=checkbox ng-if=shipmentReferenceCtrl.isAddAction()><input id=reference_set_as_default class=checkbox__input type=checkbox data-aqa-id=reference_set_as_default ng-model=shipmentReferenceCtrl.referenceSetAsDefault> <span class=label nls=shipment-settings.ship_ref__mdl_set_as_default_label></span></label><div class=row><button type=submit class=\"btn right\" ewf-click=\"shipmentReferenceCtrl.proceedAction(shipmentReferenceForm, ewfFormCtrl)\" nls=shipment-settings.ship_ref__mdl_save_btn_label></button></div></form></div></ewf-modal>'
            });
        }

        function runAddDialog() {
            vm.referenceNickname = '';
            vm.referenceSetAsDefault = false;
            vm.currentAction = actions.add;
            vm.referenceValidationError = '';
            runDialog();
        }

        function runEditDialog(updateKey) {
            vm.elementToUpdate = vm.gridData.find(function (elem) {
                return elem.key === updateKey;
            });
            vm.referenceNickname = vm.elementToUpdate.name;
            vm.currentAction = actions.edit;
            vm.referenceValidationError = '';
            runDialog();
        }

        function isAddAction() {
            return vm.currentAction === actions.add;
        }

        function proceedAction(form, ewfFormCtrl) {
            if (form.$valid || !ewfFormCtrl.ewfValidation()) {
                return vm.currentAction.method();
            }
        }

        function addReference() {
            return vm.gridCtrl.addElement({
                name: vm.referenceNickname,
                defaultRef: vm.referenceSetAsDefault
            }).then(vm.successHandler)['catch'](function () {
                vm.referenceValidationError = modalErrorMsgCode;
            });
        }

        function updateReference() {
            return vm.gridCtrl.updateElement({
                name: vm.referenceNickname,
                key: vm.elementToUpdate.key
            }).then(vm.successHandler)['catch'](function () {
                vm.referenceValidationError = modalErrorMsgCode;
            });
        }

        function successHandler(reference) {
            var actionStatus = vm.isAddAction() ? 'created' : 'updated';
            vm.modalDialog.close();
            vm.referenceValidationError = '';
            vm.gridActionStatus = Object.create(defaultGridStatus);
            vm.gridActionStatus[actionStatus] = true;
            vm.successMsgTimeout = $timeout(function () {
                vm.gridActionStatus[actionStatus] = false;
            }, systemSettings.showInformationHintTimeout);
            if (vm.referenceSetAsDefault || isDefaultReference(reference)) {
                vm.referenceDefaults.selectedReferenceKey = reference.key;
                vm.defaultReference = angular.copy(reference);
                vm.selectedDefault = reference;
            }
        }

        function onReferenceNameChange() {
            vm.referenceValidationError = '';
        }

        function getShipmentDefault() {
            ewfCrudService.getElementList(shipmentReferenceDefaultsUrl).then(function (referenceDefaults) {
                vm.referenceDefaults = referenceDefaults;
                vm.defaultReference = vm.gridData.find(isDefaultReference);
                vm.referenceDefaults.referenceLabel = vm.referenceDefaults.referenceLabel || 'Reference';
            });
        }

        function setDefaultReference() {
            var params = {};
            if (vm.selectedDefault) {
                params.selectedReferenceKey = vm.selectedDefault.key;
            }

            ewfCrudService.updateElement(shipmentReferenceDefaultsUrl, params).then(function () {
                vm.showEditDefaults = false;
                vm.defaultReference = vm.selectedDefault;
                vm.changeWithTimeout('referenceDefaultChanged');
            });
        }

        function updateReferenceLabel(event) {
            event.preventDefault();
            vm.referenceDefaults.referenceLabel = vm.referenceDefaults.referenceLabel || 'Reference';
            var params = {
                referenceLabel: vm.referenceDefaults.referenceLabel
            };
            ewfCrudService.updateElement(updateReferenceLabelUrl, params);
        }

        function toggleEditDefaults(event) {
            event.preventDefault();
            vm.showEditDefaults = !vm.showEditDefaults;
            vm.selectedDefault = vm.defaultReference;
        }

        function changeWithTimeout(property) {
            vm[property] = true;
            return $timeout(function () {
                vm[property] = false;
            }, systemSettings.showInformationHintTimeout);
        }

        function isDefaultReference(reference) {
            return reference.key === vm.referenceDefaults.selectedReferenceKey;
        }

        function gridDataWatcher(newValue, oldValue) {
            if (oldValue > newValue) {
                var reference = vm.gridData.find(isDefaultReference);
                vm.defaultReference = reference || {};
            }
        }
    }
});
//# sourceMappingURL=shipment-reference-controller.js.map
