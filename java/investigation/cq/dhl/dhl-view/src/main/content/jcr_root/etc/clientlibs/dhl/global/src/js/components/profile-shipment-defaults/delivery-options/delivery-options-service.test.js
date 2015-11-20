import EwfCrudService from './../../../services/ewf-crud-service';
import DeliveryOptionsService from './delivery-options-service';
import 'angularMocks';

describe('DeliveryOptionsService', () => {
    let $timeout;
    let $q;
    let sut;
    let crudServiceMock;
    let getDefer;
    let updateDefer;
    const deliveryOptionsUrl = '/api/myprofile/shipment/defaults/delivery';
    const countryListUrl = '/api/location/list';

    beforeEach(inject((_$q_, _$timeout_) => {
        $timeout = _$timeout_;
        $q = _$q_;
        getDefer = $q.defer();
        updateDefer = $q.defer();
        crudServiceMock = jasmine.mockComponent(new EwfCrudService());
        crudServiceMock.getElementList.and.returnValue(getDefer.promise);
        crudServiceMock.updateElement.and.returnValue(updateDefer.promise);
        sut = new DeliveryOptionsService($q, crudServiceMock);
    }));

    it('should call crud service with correct params to get country list', () => {
        sut.getCountryList();
        getDefer.resolve();
        expect(crudServiceMock.getElementList).toHaveBeenCalledWith(countryListUrl);
    });

    it('should call crud service with correct params to get delivery options', () => {
        sut.getDeliveryOptions();
        getDefer.resolve();
        expect(crudServiceMock.getElementList).toHaveBeenCalledWith(deliveryOptionsUrl);
    });

    it('should call crud service with correct params on saving delivery options', () => {
        const params = {};
        sut.saveOptions(params);
        getDefer.resolve();
        expect(crudServiceMock.updateElement).toHaveBeenCalledWith(deliveryOptionsUrl, params);
    });

    it('should convert response to appropriate when delivery options and language responses come', () => {
        sut.getData().then((response) => {
            expect(response.countryList).toBeDefined();
            expect(response.options).toBeDefined();
        });
        getDefer.resolve({});
        $timeout.flush();
    });
});
