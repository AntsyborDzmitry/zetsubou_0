import ShipmentReferenceController from './shipment-reference-controller';
import EwfGridController from './../../directives/ewf-grid/ewf-grid-controller';
import AttrsService from './../../services/attrs-service';
import EwfCrudService from './../../services/ewf-crud-service';
import ModalService from './../../services/modal/modal-service';
import systemSettings from './../../constants/system-settings-constants';
import 'angularMocks';

describe('ShipmentReferenceController', () => {
    let sut;
    let $q;
    let $scope;
    let $timeout;
    let crudServiceMock;
    let gridControllerMock;
    let modalServiceMock;
    let attrsServiceMock;
    let getDefer;
    let updateDefer;
    let gridUpdateDefer;
    let gridAddDefer;
    const sharingReferenceUrl = '/api/myprofile/shipment/references';
    const referenceLabelUrl = '/api/myprofile/shipment/defaults/references/label';
    const defaultReferenceUrl = '/api/myprofile/shipment/defaults/references';
    const bulkElementsMsgCode = 'shipment-settings.ship_ref__delete_elements_confirmation_message';
    const modalErrorMsgCode = 'shipment-settings.ship_ref__nfn_shr__mdl_error_message';
    const mockGetList = [
        {
            key: 'khbfgerl325',
            name: 'shipment label'
        },
        {
            key: '012094423',
            name: 'full metal jacket'
        }
    ];
    const referenceDefaultsMock = {
        userReferenceList: [
            {
                key: '001',
                name: 'Reference1'
            },
            {
                key: '002',
                name: 'Reference2'
            }
        ],
        selectedReferenceKey: '002',
        referenceLabel: 'My favourite label'
    };
    const columnsToDisplay = [
        {
            alias: 'name',
            title: 'shipment-settings.ship_ref__nickname'
        }
    ];
    const defaultGridStatus = {
        created: false,
        updated: false,
        deleted: false,
        rejected: false
    };
    const reference = mockGetList[0];
    const event = {
        preventDefault: () => {}
    };

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {
        $scope = _$rootScope_.$new();
        $q = _$q_;
        $timeout = _$timeout_;
        gridUpdateDefer = $q.defer();
        gridAddDefer = $q.defer();
        getDefer = $q.defer();
        updateDefer = $q.defer();
        modalServiceMock = jasmine.mockComponent(new ModalService());
        modalServiceMock.showDialog.and.returnValue({
            close: () => {}
        });
        attrsServiceMock = jasmine.mockComponent(new AttrsService());
        crudServiceMock = jasmine.mockComponent(new EwfCrudService());
        crudServiceMock.getElementList.and.returnValue(getDefer.promise);
        crudServiceMock.updateElement.and.returnValue(updateDefer.promise);
        gridControllerMock = jasmine.mockComponent(
            new EwfGridController($scope, {}, $timeout, $q, {}, crudServiceMock, attrsServiceMock)
        );
        gridControllerMock.rebuildGrid.and.returnValue('');
        gridControllerMock.updateElement.and.returnValue(gridUpdateDefer.promise);
        gridControllerMock.addElement.and.returnValue(gridAddDefer.promise);
        sut = new ShipmentReferenceController($scope, $timeout, crudServiceMock, modalServiceMock, systemSettings);
        sut.gridCtrl = gridControllerMock;
        spyOn(sut, 'addReference').and.callThrough();
        spyOn(sut, 'successHandler').and.callThrough();
        spyOn($scope, '$watch').and.callThrough();
        sut.modalDialog = {
            close: () => {}
        };
        sut.gridData = [];
    }));

    describe('ShipmentReferenceController', () => {

        it('should have preloader marker to be set', () => {
            expect(sut.connected).toEqual(false);
        });

        it('should have columnsToDisplay to be correct', () => {
            expect(sut.columnsToDisplay).toEqual(columnsToDisplay);
        });

        it('should check result of get references list call', () => {
            sut.init();
            getDefer.resolve(mockGetList);
            $timeout.flush();
            expect(sut.connected).toEqual(true);
        });

        it('should rebuild grid after getting reference list', () => {
            sut.init();
            getDefer.resolve(mockGetList);
            $timeout.flush();
            expect(sut.gridCtrl.rebuildGrid).toHaveBeenCalled();
        });

        it('should check that service is called', () => {
            sut.init();
            getDefer.resolve(mockGetList);
            expect(crudServiceMock.getElementList).toHaveBeenCalledWith(sharingReferenceUrl);
        });

        it('should change sharing references list if service succeed', () => {
            sut.init();
            getDefer.resolve(mockGetList);
            $timeout.flush();
            expect(sut.gridData).toEqual(mockGetList);
        });

        it('should call bulkDeleteElements in grid control with correct parameters', () => {
            sut.bulkDeleteElements();
            expect(gridControllerMock.bulkDeleteElements).toHaveBeenCalledWith(bulkElementsMsgCode);
        });

        it('should have grid control with edit callback', () => {
            sut.init();
            expect(sut.gridCtrl.editCallback).toBeDefined();
        });

        it('should call modal service for adding', () => {
            sut.runAddDialog();
            expect(modalServiceMock.showDialog).toHaveBeenCalled();
        });

        it('should call modal service for editing', () => {
            sut.gridData = mockGetList;
            sut.runEditDialog(mockGetList[0].key);
            expect(modalServiceMock.showDialog).toHaveBeenCalled();
        });

        it('should set element for edit when before modal for editing is open', () => {
            sut.gridData = mockGetList;
            sut.runEditDialog(reference.key);
            expect(sut.elementToUpdate).toEqual(reference);
        });

        it('should set element nickname before modal for editing is open', () => {
            sut.gridData = mockGetList;
            sut.runEditDialog(reference.key);
            expect(sut.referenceNickname).toEqual(reference.name);
        });

        it('should return true if current action is adding', () => {
            sut.currentAction = {
                title: 'shipment-settings.nfn_shr__mdl_add_dlg_title',
                method: sut.addReference
            };
            expect(sut.isAddAction).toBeTruthy();
        });

        it('should do not call current handler if form is invalid', () => {
            const invalidForm = {
                $invalid: true
            };
            const formCtrl = {
                ewfValidation: () => {}
            };
            sut.runAddDialog();
            sut.proceedAction(invalidForm, formCtrl);
            expect(sut.addReference).not.toHaveBeenCalled();
        });

        it('should call grid for adding the element when adding correct reference', () => {
            const addParams = {
                name: 'nickName',
                defaultRef: false
            };
            sut.referenceNickname = addParams.name;
            sut.referenceSetAsDefault = addParams.defaultRef;
            sut.addReference();
            expect(gridControllerMock.addElement).toHaveBeenCalledWith(addParams);
        });

        it('should call grid for updateElement when editing reference', () => {
            const addParams = {
                name: 'nickName',
                defaultRef: false
            };
            sut.referenceNickname = addParams.name;
            sut.referenceSetAsDefault = addParams.defaultRef;
            sut.addReference();
            expect(gridControllerMock.addElement).toHaveBeenCalledWith(addParams);
        });

        it('should set error when element wasn\'t added', () => {
            const editParams = {
                name: 'nickName',
                key: 1
            };
            sut.referenceNickname = editParams.name;
            sut.elementToUpdate = {
                key: editParams.key
            };
            sut.updateReference();
            expect(gridControllerMock.updateElement).toHaveBeenCalledWith(editParams);
        });

        it('should set correct grid action status when element has been added', () => {
            let addStatus = Object.create(defaultGridStatus);
            addStatus.created = true;
            sut.runAddDialog();
            sut.successHandler(reference);
            expect(sut.gridActionStatus).toEqual(addStatus);
        });

        it('should call success handler in case of element was added', () => {
            sut.addReference();
            gridAddDefer.resolve(reference);
            $timeout.flush();
            expect(sut.successHandler).toHaveBeenCalled();
        });

        it('should remove error if reference has been added', () => {
            sut.addReference();
            gridAddDefer.reject();
            $timeout.flush();
            expect(sut.referenceValidationError).toEqual(modalErrorMsgCode);
        });

        it('should set correct grid action status when element has been edited', () => {
            let editStatus = Object.create(defaultGridStatus);
            editStatus.updated = true;
            sut.successHandler(reference);
            expect(sut.gridActionStatus).toEqual(editStatus);
        });

        it('should call success handler in case of element was edited', () => {
            sut.elementToUpdate = {};
            sut.updateReference();
            gridUpdateDefer.resolve(reference);
            $timeout.flush();
            expect(sut.successHandler).toHaveBeenCalled();
        });

        it('should set error when element wasn\'t edited successful', () => {
            sut.elementToUpdate = {};
            sut.updateReference();
            gridUpdateDefer.reject();
            $timeout.flush();
            expect(sut.referenceValidationError).toEqual(modalErrorMsgCode);
        });

        it('should remove error if reference has been edited', () => {
            sut.elementToUpdate = {};
            sut.updateReference();
            gridUpdateDefer.resolve(reference);
            $timeout.flush();
            expect(sut.referenceValidationError).toEqual('');
        });

        it('should reset error, when opening new edit popup', () => {
            sut.referenceValidationError = modalErrorMsgCode;
            sut.gridData = mockGetList;
            sut.runEditDialog(reference.key);
            expect(sut.referenceValidationError).toEqual('');
        });

        it('should reset error, when opening new add popup', () => {
            sut.referenceValidationError = modalErrorMsgCode;
            sut.runAddDialog();
            expect(sut.referenceValidationError).toEqual('');
        });

        it('should reset grid success statuses after modal system timeout', () => {
            sut.successHandler(reference);
            expect(sut.gridActionStatus.updated).toBe(true);
            $timeout.flush();
            expect(sut.gridActionStatus.updated).toBe(false);
        });

        it('should reset server validation when name of reference has been changed', () => {
            sut.referenceValidationError = modalErrorMsgCode;
            sut.onReferenceNameChange();
            expect(sut.referenceValidationError).toEqual('');
        });

        it('should call crud service to get default reference and label', () => {
            sut.init();
            expect(crudServiceMock.getElementList).toHaveBeenCalledWith(defaultReferenceUrl);
        });

        it('should set default reference after response come', () => {
            sut.getShipmentDefault();
            getDefer.resolve(referenceDefaultsMock);
            $timeout.flush();
            expect(sut.referenceDefaults.selectedReferenceKey).toEqual(referenceDefaultsMock.selectedReferenceKey);
        });

        it('should set reference label after response come', () => {
            sut.getShipmentDefault();
            getDefer.resolve(referenceDefaultsMock);
            $timeout.flush();
            expect(sut.referenceDefaults.referenceLabel).toEqual(referenceDefaultsMock.referenceLabel);
        });

        it('should set reference label to default if its empty', () => {
            referenceDefaultsMock.referenceLabel = '';
            sut.getShipmentDefault();
            getDefer.resolve(referenceDefaultsMock);
            $timeout.flush();
            expect(sut.referenceDefaults.referenceLabel).toEqual('Reference');
        });

        it('should set default reference when reference was added with default flag', () => {
            sut.referenceSetAsDefault = true;
            sut.successHandler(reference);
            expect(sut.referenceDefaults.selectedReferenceKey).toEqual(reference.key);
            sut.referenceDefaults.selectedReferenceKey = null;
            sut.referenceSetAsDefault = false;
            sut.successHandler(reference);
            expect(sut.referenceDefaults.selectedReferenceKey).not.toEqual(reference.key);
        });

        it('should call crud service on setting up default reference', () => {
            const params = {
                selectedReferenceKey: reference.key
            };
            sut.selectedDefault = reference;
            sut.referenceDefaults.selectedReferenceKey = reference.key;
            sut.setDefaultReference();
            expect(crudServiceMock.updateElement).toHaveBeenCalledWith(defaultReferenceUrl, params);
        });

        it('should exit from edit mode after success form submit', () => {
            sut.setDefaultReference();
            updateDefer.resolve();
            $timeout.flush();
            expect(sut.showEditDefaults).toBe(false);
        });

        it('should call crud service on reference label update', () => {
            const params = {
                referenceLabel: 'new reference label'
            };
            sut.referenceDefaults.referenceLabel = params.referenceLabel;
            sut.updateReferenceLabel(event);
            expect(crudServiceMock.updateElement).toHaveBeenCalledWith(referenceLabelUrl, params);
        });

        it('should toggle show edit defaults', () => {
            sut.showEditDefaults = false;
            sut.toggleEditDefaults(event);
            expect(sut.showEditDefaults).toBe(true);
            sut.toggleEditDefaults(event);
            expect(sut.showEditDefaults).toBe(false);
        });

        it('should change boolean value with timeout', () => {
            sut.value = false;
            sut.changeWithTimeout('value');
            expect(sut.value).toBeTruthy();
            $timeout.flush();
            expect(sut.value).toBeFalsy();
        });

        it('should change default reference name if reference was with default key', () => {
            sut.referenceDefaults.selectedReferenceKey = reference.key;
            sut.defaultReference = {
                name: '',
                key: reference.key
            };
            sut.successHandler(reference);
            expect(sut.defaultReference.name).toBe(reference.name);
        });

        it('should call watcher for length of grid data', () => {
            const gridDataLength = 'shipmentReferenceCtrl.gridData.length';
            sut.getShipmentReferenceList();
            getDefer.resolve(mockGetList);
            $timeout.flush();
            expect($scope.$watch).toHaveBeenCalledWith(gridDataLength, sut.gridDataWatcher);
        });

        it('should reset default reference, if it was deleted from the list', () => {
            sut.gridData = [];
            sut.defaultReference = reference;
            sut.gridDataWatcher(3, 4);
            expect(sut.defaultReference.name).not.toBeDefined();
        });

        it('should fill empty default reference with placeholder data', () => {
            sut.referenceDefaults.referenceLabel = '';
            sut.updateReferenceLabel(event);
            expect(sut.referenceDefaults.referenceLabel).toEqual('Reference');
        });
    });

});
