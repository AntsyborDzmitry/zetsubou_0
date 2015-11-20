import AddressEntryController from './address-entry-controller';
import ewfCrudService from './../../../services/ewf-crud-service';
import NavigationService from './../../../services/navigation-service';
import 'angularMocks';

describe('AddressEntryController', () => {
    let sut;
    let $q;
    let $scope;
    let $timeout;
    let crudServiceMock;
    let navigationServiceMock;
    let getDefer;
    let updateDefer;

    const ADDRESS_ENTRY_URL_PARAMETER = 'addressEntry';

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {
        $scope = _$rootScope_.$new();
        $q = _$q_;
        $timeout = _$timeout_;
        getDefer = $q.defer();
        updateDefer = $q.defer();

        navigationServiceMock = jasmine.mockComponent(new NavigationService());
        crudServiceMock = jasmine.mockComponent(new ewfCrudService());
        crudServiceMock.getElementList.and.returnValue(getDefer.promise);
        crudServiceMock.updateElement.and.returnValue(updateDefer.promise);

        sut = new AddressEntryController($scope, crudServiceMock, navigationServiceMock);

    }));

    it('should call crudService for getting a model', () => {
        sut.init();
        expect(crudServiceMock.getElementList).toHaveBeenCalled();
    });

    it('should get model from crudService and store it', () => {
        const response = {
            residentialDefault: false
        };
        sut.init();
        getDefer.resolve(response);
        $timeout.flush();
        expect(sut.residentialDefault).toEqual(response.residentialDefault);
    });

    it('should send updates to server, when model changes saved', () => {
        sut.init();
        sut.residentialDefaultCache = true;
        sut.updateResidentialDefault();
        expect(crudServiceMock.updateElement).toHaveBeenCalledWith('/api/myprofile/shipment/defaults/address',
            {residentialDefault: true});
    });

    it('should send updates to server, when model changes saved', () => {
        const addressEntryMock = {
            residentialDefault: true
        };

        sut.init();
        sut.residentialDefaultCache = true;
        sut.updateResidentialDefault();
        updateDefer.resolve(addressEntryMock);
        $timeout.flush();
        expect(sut.residentialDefault).toEqual(true);
    });


    it('should restore previous value on a view, when closed without saving', () => {
        sut.residentialDefault = false;
        sut.residentialDefaultCache = true;
        sut.restoreDefaults();
        expect(sut.residentialDefaultCache).toEqual(sut.residentialDefault);
    });

    it('should show section', () => {
        navigationServiceMock.getParamFromUrl.and.returnValue(ADDRESS_ENTRY_URL_PARAMETER);
        sut = new AddressEntryController($scope, crudServiceMock, navigationServiceMock);
        sut.isEditing = false;
        sut.preloadSectionFromUrl();
        expect(sut.isEditing).toEqual(true);
    });

    it('should hide section', () => {
        navigationServiceMock.getParamFromUrl.and.returnValue('otherTab');
        sut = new AddressEntryController($scope, crudServiceMock, navigationServiceMock);
        sut.isEditing = true;
        sut.preloadSectionFromUrl();
        expect(sut.isEditing).toEqual(false);
    });

});
