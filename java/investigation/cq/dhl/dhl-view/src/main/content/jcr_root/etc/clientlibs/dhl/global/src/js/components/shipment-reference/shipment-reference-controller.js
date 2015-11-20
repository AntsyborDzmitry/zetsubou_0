import './../../services/ewf-crud-service';
import './../../services/modal/modal-service';
import './../../constants/system-settings-constants';

ShipmentReferenceController.$inject = [
    '$scope',
    '$timeout',
    'ewfCrudService',
    'modalService',
    'systemSettings'
];

export default function ShipmentReferenceController(
    $scope,
    $timeout,
    ewfCrudService,
    modalService,
    systemSettings) {

    let modalDialog;
    let currentAction;
    let gridActionStatus = {};
    const defaultGridStatus = {
        created: false,
        updated: false,
        deleted: false,
        rejected: false
    };
    const vm = this;
    const shipmentReferencesUrl = '/api/myprofile/shipment/references';
    const shipmentReferenceDefaultsUrl = '/api/myprofile/shipment/defaults/references';
    const updateReferenceLabelUrl = '/api/myprofile/shipment/defaults/references/label';
    const bulkElementsMsgCode = 'shipment-settings.ship_ref__delete_elements_confirmation_message';
    const modalErrorMsgCode = 'shipment-settings.ship_ref__nfn_shr__mdl_error_message';
    const actions = {
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
        columnsToDisplay: [
            {
                alias: 'name',
                title: 'shipment-settings.ship_ref__nickname'
            }
        ],
        gridActionStatus,
        currentAction,
        modalDialog,
        successHandler,
        runAddDialog,
        runEditDialog,
        isAddAction,
        proceedAction,
        addReference,
        updateReference,
        onReferenceNameChange,
        init,
        bulkDeleteElements,
        notificationData: '',
        setDefaultReference,
        updateReferenceLabel,
        toggleEditDefaults,
        changeWithTimeout,
        getShipmentReferenceList,
        getShipmentDefault,
        gridDataWatcher
    });

    function init() {
        vm.getShipmentReferenceList();
        vm.getShipmentDefault();
        vm.gridCtrl.editCallback = runEditDialog;
    }

    function getShipmentReferenceList() {
        ewfCrudService.getElementList(shipmentReferencesUrl)
            .then((referencesList) => {
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
            templateUrl: 'shipment-reference-modal.html'
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
        vm.elementToUpdate = vm.gridData.find((elem) => elem.key === updateKey);
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
        })
            .then(vm.successHandler)
            .catch(function() {
                vm.referenceValidationError = modalErrorMsgCode;
            });
    }

    function updateReference() {
        return vm.gridCtrl.updateElement({
            name: vm.referenceNickname,
            key: vm.elementToUpdate.key
        })
            .then(vm.successHandler)
            .catch(function() {
                vm.referenceValidationError = modalErrorMsgCode;
            });
    }

    function successHandler(reference) {
        const actionStatus = vm.isAddAction() ? 'created' : 'updated';
        vm.modalDialog.close();
        vm.referenceValidationError = '';
        vm.gridActionStatus = Object.create(defaultGridStatus);
        vm.gridActionStatus[actionStatus] = true;
        vm.successMsgTimeout = $timeout(() => {
                vm.gridActionStatus[actionStatus] = false;
            },
            systemSettings.showInformationHintTimeout
        );
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
        ewfCrudService.getElementList(shipmentReferenceDefaultsUrl)
            .then((referenceDefaults) => {
                vm.referenceDefaults = referenceDefaults;
                vm.defaultReference = vm.gridData.find(isDefaultReference);
                vm.referenceDefaults.referenceLabel = vm.referenceDefaults.referenceLabel || 'Reference';
            });
    }

    function setDefaultReference() {
        const params = {};
        if (vm.selectedDefault) {
            params.selectedReferenceKey = vm.selectedDefault.key;
        }

        ewfCrudService.updateElement(shipmentReferenceDefaultsUrl, params)
            .then(() => {
                vm.showEditDefaults = false;
                vm.defaultReference = vm.selectedDefault;
                vm.changeWithTimeout('referenceDefaultChanged');
            });
    }

    function updateReferenceLabel(event) {
        event.preventDefault();
        vm.referenceDefaults.referenceLabel = vm.referenceDefaults.referenceLabel || 'Reference';
        const params = {
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
        return $timeout(() => {
                vm[property] = false;
            },
            systemSettings.showInformationHintTimeout
        );
    }

    function isDefaultReference(reference) {
        return reference.key === vm.referenceDefaults.selectedReferenceKey;
    }

    function gridDataWatcher(newValue, oldValue) {
        if (oldValue > newValue) {
            const reference = vm.gridData.find(isDefaultReference);
            vm.defaultReference = reference || {};
        }
    }
}
