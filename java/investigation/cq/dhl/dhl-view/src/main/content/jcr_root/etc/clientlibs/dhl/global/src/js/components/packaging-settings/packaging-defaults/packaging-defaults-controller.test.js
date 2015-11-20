import PackagingDefaultsController from './packaging-defaults-controller';
import profileShipmentService from './../../profile-shipment-defaults/services/profile-shipment-service';
import 'angularMocks';

describe('PackagingDefaultsController', () => {
    let sut;
    let deferred;

    let $timeout;

    let ewfCrudServiceMock;
    let profileShipmentServiceMock;
    let ewfFormCtrlMock;
    let validDefaultsFormMock;
    let invalidDefaultsFormMock;

    beforeEach(inject((_$q_, _$timeout_) => {
        deferred = _$q_.defer();

        $timeout = _$timeout_;

        ewfCrudServiceMock = {
            getElementList: jasmine.createSpy('getElementList').and.returnValue(deferred.promise),
            updateElement: jasmine.createSpy('updateElement').and.returnValue(deferred.promise)
        };

        ewfFormCtrlMock = {
            ewfValidation: jasmine.createSpy('ewfValidation')
        };

        validDefaultsFormMock = {
            $valid: true
        };

        invalidDefaultsFormMock = {
            $valid: false
        };

        profileShipmentServiceMock = jasmine.mockComponent(new profileShipmentService(ewfCrudServiceMock));

        profileShipmentServiceMock.getPackagesData.and.returnValue(deferred.promise);
        profileShipmentServiceMock.updatePackagesData.and.returnValue(deferred.promise);

        sut = new PackagingDefaultsController(profileShipmentServiceMock);

        sut.init();
    }));

    describe('#init', () => {
        it('should make sure initial is View mode', () => {
            expect(sut.isEditMode()).toEqual(false);
            expect(sut.isViewMode()).toEqual(true);
        });

        it('should switch mode to Edit on call setEditMode', () => {
            sut.setEditMode();

            expect(sut.isEditMode()).toEqual(true);
            expect(sut.isViewMode()).toEqual(false);
        });

        it('should make call to API to get packages defaults data', () => {
            expect(profileShipmentServiceMock.getPackagesData).toHaveBeenCalledWith();
        });

        it('should initialize defaults by empty model', () => {
            expect(sut.defaults).toEqual(jasmine.objectContaining({
                dhlShippingDocuments: [],
                dhlShippingPackages: []
            }));
        });

        it('should get package defaults data', () => {
            const dhlShippingDocuments = [1];
            const dhlShippingPackages = [2];
            const data = {
                dhlShippingDocuments,
                dhlShippingPackages
            };

            deferred.resolve(data);
            $timeout.flush();

            expect(sut.defaults).toBe(data);
        });

        it('should invalidate cached grid data on receiving dhl defaults', () => {
            const gridData = [];
            const cache01 = sut.getAvailablePackages(gridData);
            const cache02 = sut.getAvailablePackages(gridData);

            expect(cache02).toBe(cache01);

            deferred.resolve({
                dhlShippingDocuments: [],
                dhlShippingPackages: []
            });
            $timeout.flush();

            const cache03 = sut.getAvailablePackages(gridData);
            const cache04 = sut.getAvailablePackages(gridData);

            expect(cache04).toBe(cache03);
            expect(cache03).not.toBe(cache02);
            expect(cache03).toEqual(cache02);
        });
    });

    describe('#applyChanges', () => {
        it('should force broadcasting ValidateForm event', () => {
            sut.applyChanges({}, ewfFormCtrlMock);

            expect(ewfFormCtrlMock.ewfValidation).toHaveBeenCalledWith();
        });

        it('should not make call to API if form is not valid', () => {
            sut.applyChanges(invalidDefaultsFormMock, ewfFormCtrlMock);

            expect(profileShipmentServiceMock.updatePackagesData).not.toHaveBeenCalled();
        });

        it('should make call to API to save package defaults data', () => {
            const dhlShippingDocuments = [1];
            const dhlShippingPackages = [2];
            const data = {
                dhlShippingDocuments,
                dhlShippingPackages
            };

            deferred.resolve(data);
            $timeout.flush();
            sut.applyChanges(validDefaultsFormMock, ewfFormCtrlMock);

            expect(profileShipmentServiceMock.updatePackagesData).toHaveBeenCalledWith(data);
        });

        it('should back component to view mode', () => {
            const dhlShippingDocuments = [1];
            const dhlShippingPackages = [2];
            const data = {
                dhlShippingDocuments,
                dhlShippingPackages
            };

            deferred.resolve(data);
            $timeout.flush();
            sut.applyChanges(validDefaultsFormMock, ewfFormCtrlMock);
            $timeout.flush();

            expect(sut.isEditMode()).toEqual(false);
        });
    });

    describe('#cancelChanges', () => {
        it('should revert data changed during edit session', () => {
            const dhlShippingDocuments = [1];
            const dhlShippingPackages = [2];
            const initialData = {
                someField: 'someValue',
                dhlShippingDocuments,
                dhlShippingPackages
            };
            const changedData = {
                someField: 'someUpdValue',
                dhlShippingDocuments,
                dhlShippingPackages
            };

            deferred.resolve(initialData);
            $timeout.flush();
            sut.setEditMode();
            sut.defaults = changedData;
            sut.cancelChanges();

            expect(sut.defaults).toEqual(initialData);
            expect(sut.defaults).not.toEqual(changedData);
        });

        it('should back component to view mode', () => {
            sut.setEditMode();
            sut.cancelChanges();

            expect(sut.isEditMode()).toEqual(false);
        });
    });

    describe('#mapOptionKey', () => {
        it('should return null if provided input is not valuable', () => {
            expect(sut.mapOptionKey(null)).toEqual(null);

            expect(sut.mapOptionKey('')).toEqual(null);
        });

        it('should return input as is if provided input is valuable, and do not have "key" property', () => {
            expect(sut.mapOptionKey('qwer')).toEqual('qwer');

            expect(sut.mapOptionKey(234)).toEqual(234);
        });

        it('should return option.key property value if provided input has it', () => {
            const key = 1234;

            expect(sut.mapOptionKey({
                key
            })).toEqual(key);
        });
    });

    describe('#getAvailableDocuments', () => {
        it('should cache incoming grid data and reuse it on next call', () => {
            const dhlShippingDocuments = [{
                key: 'key01',
                name: 'name01'
            }];
            const dhlShippingPackages = [{
                key: 'key02',
                name: 'name02'
            }];
            const dhlData = {
                dhlShippingDocuments,
                dhlShippingPackages
            };
            const gridData = [
                {
                    key: 'key03',
                    nickName: 'nickName01',
                    packagingType: 'PACKAGE'
                },
                {
                    key: 'key04',
                    nickName: 'nickName02',
                    packagingType: 'DOCUMENT'
                },
                {
                    key: 'key05',
                    nickName: 'nickName03',
                    packagingType: 'BOTH'
                }
            ];
            const mockDocuments = dhlShippingDocuments.concat(gridData.slice(1).map((item) => ({
                key: item.key,
                name: item.nickName,
                type: item.packagingType
            })));

            deferred.resolve(dhlData);
            $timeout.flush();
            const cachedAvailableDocuments = sut.getAvailableDocuments(gridData);

            expect(sut.getAvailableDocuments(gridData)).toEqual(mockDocuments);
            expect(sut.getAvailableDocuments(gridData)).toBe(cachedAvailableDocuments);
        });
    });

    describe('#getSelectedDocumentName', () => {
        it('should return name for selected document by key', () => {
            const documentKey = 'key03';
            const documentName = 'nickName';
            const dhlShippingDocuments = [{
                key: 'key01',
                name: 'name01'
            }];
            const dhlShippingPackages = [{
                key: 'key02',
                name: 'name02'
            }];
            const dhlData = {
                dhlShippingDocuments,
                dhlShippingPackages,
                selectedShippingDocumentKey: documentKey
            };
            const gridData = [{
                key: documentKey,
                nickName: documentName,
                packagingType: 'DOCUMENT'
            }];

            deferred.resolve(dhlData);
            $timeout.flush();

            expect(sut.getSelectedDocumentName(gridData)).toBe(documentName);
        });
    });

    describe('#getAvailablePackages', () => {
        it('should cache incoming grid data and reuse it on next call', () => {
            const dhlShippingDocuments = [{
                key: 'key01',
                name: 'name01'
            }];
            const dhlShippingPackages = [{
                key: 'key02',
                name: 'name02'
            }];
            const dhlData = {
                dhlShippingDocuments,
                dhlShippingPackages
            };
            const gridData = [
                {
                    key: 'key03',
                    nickName: 'nickName01',
                    packagingType: 'PACKAGE'
                },
                {
                    key: 'key04',
                    nickName: 'nickName02',
                    packagingType: 'DOCUMENT'
                },
                {
                    key: 'key05',
                    nickName: 'nickName03',
                    packagingType: 'BOTH'
                }
            ];
            const mockPackages = dhlShippingPackages.concat([gridData[0], gridData[2]].map((item) => ({
                key: item.key,
                name: item.nickName,
                type: item.packagingType
            })));

            deferred.resolve(dhlData);
            $timeout.flush();
            const cachedAvailablePackages = sut.getAvailablePackages(gridData);

            expect(sut.getAvailablePackages(gridData)).toEqual(mockPackages);
            expect(sut.getAvailablePackages(gridData)).toBe(cachedAvailablePackages);
        });
    });

    describe('#getSelectedPackageName', () => {
        it('should return name for selected package by key', () => {
            const packageKey = 'key03';
            const packageName = 'nickName';
            const dhlShippingDocuments = [{
                key: 'key01',
                name: 'name01'
            }];
            const dhlShippingPackages = [{
                key: 'key02',
                name: 'name02'
            }];
            const dhlData = {
                dhlShippingDocuments,
                dhlShippingPackages,
                selectedShippingPackageKey: packageKey
            };
            const gridData = [{
                key: packageKey,
                nickName: packageName,
                packagingType: 'PACKAGE'
            }];

            deferred.resolve(dhlData);
            $timeout.flush();

            expect(sut.getSelectedPackageName(gridData)).toBe(packageName);
        });
    });
});
