import AssigningShipmentsController from './assigning-shipments-controller';
import NavigationService from './../../../services/navigation-service';
import EwfCrudService from './../../../services/ewf-crud-service';

import 'angularMocks';

describe('AssigningShipmentsController', () => {
    const dataUrl = '/api/myprofile/shipment/assignment/defaults';
    const supportingUrl = '/api/myprofile/shipment/assignment/notifications/intervals';

    let sut;
    let ewfCrudServiceMock;
    let navigationServiceMock;

    let deferred;
    let $timeout;

    beforeEach(inject((_$q_, _$timeout_) => {
        deferred = _$q_.defer();
        $timeout = _$timeout_;

        ewfCrudServiceMock = jasmine.mockComponent(new EwfCrudService());
        ewfCrudServiceMock.getElementList.and.returnValue(deferred.promise);
        ewfCrudServiceMock.changeElement.and.returnValue(deferred.promise);

        navigationServiceMock = jasmine.mockComponent(new NavigationService());
        navigationServiceMock.getParamFromUrl.and.returnValue(null);

        sut = new AssigningShipmentsController(ewfCrudServiceMock, navigationServiceMock);

        sut.init();
    }));

    describe('#init', () => {
        it('should make call to API endpoint', () => {
            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(dataUrl);
        });

        it('should make sure main data is correct', () => {
            const dataMock = {
                someField: 'some value'
            };

            deferred.resolve(dataMock);

            $timeout.flush();

            expect(sut.assigningOptions).toBe(dataMock);
        });

        it('should make call to API endpoint for supporting data', () => {
            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(supportingUrl);
        });

        it('should make sure supporting data is correct', () => {
            const dataMock = {
                someField: 'some value'
            };

            deferred.resolve(dataMock);

            $timeout.flush();

            expect(sut.notificationOptions).toBe(dataMock);
        });

        it('should initialize in view mode', () => {
            expect(sut.isEditMode()).toEqual(false);
        });

        it('should initialize in edit mode', () => {
            navigationServiceMock.getParamFromUrl.and.returnValue('assigningShipments');

            sut.init();

            expect(sut.isEditMode()).toEqual(true);
        });
    });

    describe('#setEditMode', () => {
        it('should switch mode to edit on call', () => {
            sut.setEditMode();

            expect(sut.isEditMode()).toEqual(true);
        });
    });

    describe('#cancelChanges', () => {
        it('should revert data changed during edit session', () => {
            const initialData = {
                someField: 'some value'
            };
            const fakeData = {
                someField: 'some other value'
            };

            deferred.resolve(initialData);

            $timeout.flush();

            sut.setEditMode();

            sut.assigningOptions = fakeData;

            sut.cancelChanges();

            expect(sut.assigningOptions).toEqual(initialData);
            expect(sut.assigningOptions).not.toBe(fakeData);
        });

        it('should back component to view mode', () => {
            sut.setEditMode();
            sut.cancelChanges();

            expect(sut.isEditMode()).toEqual(false);
        });
    });

    describe('#applyChanges', () => {
        it('should make call to API endpoint', () => {
            const changedData = {
                someField: 'some value'
            };

            sut.setEditMode();

            sut.assigningOptions = changedData;

            sut.applyChanges();

            expect(ewfCrudServiceMock.changeElement).toHaveBeenCalledWith(dataUrl, changedData);

            deferred.resolve(angular.copy(changedData));

            $timeout.flush();

            expect(sut.assigningOptions).not.toBe(changedData);
            expect(sut.assigningOptions).toEqual(changedData);

            expect(sut.isEditMode()).toEqual(false);
        });
    });
});
