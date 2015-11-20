import MyDhlAccountsController from './my-dhl-accounts-controller';
import EwfCrudService from './../../../services/ewf-crud-service';
import EwfGridController from './../../../directives/ewf-grid/ewf-grid-controller';
import AttrsService from './../../../services/attrs-service';
import EwfSpinnerService from './../../../services/ewf-spinner-service';
import 'angularMocks';

describe('MyDhlAccountsController', function() {
    let sut;
    let logServiceMock, ewfCrudServiceMock, ewfGridControllerMock;
    let $scope, $q, $timeout, defer, addDefer;
    let myDhlAccountPromise, attrsServiceMock, ewfSpinnerServiceMock;

    const emptySingleAccount = {
        key: '',
        accountNumber: '',
        accountNickname: '',
        accountType: '',
        alternative: true
    };

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = _$rootScope_;

        myDhlAccountPromise = $q.defer();
        defer = $q.defer();
        addDefer = $q.defer();

        logServiceMock = jasmine.createSpyObj('logService', ['error', 'log']);
        attrsServiceMock = jasmine.mockComponent(new AttrsService());
        ewfSpinnerServiceMock = jasmine.mockComponent(new EwfSpinnerService());
        ewfCrudServiceMock = jasmine.mockComponent(new EwfCrudService());
        ewfCrudServiceMock.addElement.and.returnValue(addDefer.promise);
        ewfCrudServiceMock.updateElement.and.returnValue(defer.promise);
        ewfCrudServiceMock.getElementList.and.returnValue(myDhlAccountPromise.promise);

        ewfGridControllerMock = jasmine.mockComponent(
            new EwfGridController(
                $scope,
                {},
                $timeout,
                $q,
                {},
                ewfCrudServiceMock,
                attrsServiceMock
            )
        );
        ewfGridControllerMock.rebuildGrid.and.returnValue('');

        sut = new MyDhlAccountsController(logServiceMock, ewfCrudServiceMock, ewfSpinnerServiceMock);
        sut.gridCtrl = ewfGridControllerMock;
    }));

    describe('#init', () => {
        let serverResponse, dataInGrid;
        beforeEach(() => {
            const objFromServer = [{vall: 'vall'}];
            serverResponse = objFromServer;
            dataInGrid = objFromServer;
        });

        it('should call grid init with parsed data', () => {
            sut.init();

            myDhlAccountPromise.resolve(serverResponse);
            $timeout.flush();

            expect(sut.gridData).toEqual(dataInGrid);
            expect(sut.gridCtrl.rebuildGrid).toHaveBeenCalledWith(dataInGrid);
        });

        it('should call grid init with spinner', () => {
            sut.init();

            myDhlAccountPromise.resolve(serverResponse);
            $timeout.flush();

            expect(ewfSpinnerServiceMock.applySpinner).toHaveBeenCalled();
        });
    });

    describe('#saveOrUpdate', () => {
        let serverResponse, dataInGrid;
        beforeEach(() => {
            const objFromServer = {key: 'key'};
            serverResponse = objFromServer;
            dataInGrid = objFromServer;
        });

        it(' add should call grid init with parsed data', () => {
            sut.singleAccount = {nokey: 'key'};
            sut.saveOrUpdate({$valid: true}, {ewfValidation: () => {}});

            addDefer.resolve(serverResponse);
            $timeout.flush();

            expect(sut.gridData).toEqual([dataInGrid]);
            expect(sut.gridCtrl.rebuildGrid).toHaveBeenCalledWith([dataInGrid]);
        });

        it(' update should call grid init with parsed data', () => {
            sut.singleAccount = {key: 'key'};
            sut.gridData = [dataInGrid];
            sut.saveOrUpdate({$valid: true}, {ewfValidation: () => {}});
            defer.resolve(serverResponse);
            $timeout.flush();

            expect(sut.gridData).toEqual([dataInGrid]);
            expect(sut.gridCtrl.rebuildGrid).toHaveBeenCalledWith([dataInGrid]);
        });
    });

    describe('#closeDialog', () => {
        it('should check is showEditPopup is false', () => {
            sut.closeDialog();

            expect(sut.showEditPopup).toBe(false);
        });
    });

    describe('#showAddDialog', () => {
        it('should shows dialog', () => {
            sut.showAddDialog();

            expect(sut.showEditPopup).toBe(true);
        });

        it('should clears data in single package object', () => {
            sut.showAddDialog();

            expect(sut.singleAccount).not.toBe(emptySingleAccount);
            expect(sut.singleAccount).toEqual(emptySingleAccount);
        });
    });

    describe('#showDialog', () => {
        it('should check is showEditPopup is false', () => {
            sut.showDialog();

            expect(sut.showEditPopup).toBe(true);
        });
    });

    describe('#editAction', () => {
        it('should open pop-up for edit', () => {
            const key = 'key';
            sut.editAction(key);

            expect(sut.showEditPopup).toBe(true);
        });
    });
});
