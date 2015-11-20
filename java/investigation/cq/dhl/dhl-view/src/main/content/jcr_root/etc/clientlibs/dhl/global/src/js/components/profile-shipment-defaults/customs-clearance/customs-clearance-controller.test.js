import CustomsClearanceController from './customs-clearance-controller';
import EwfCrudService from './../../../services/ewf-crud-service';
import NavigationService from './../../../services/navigation-service';
import 'angularMocks';

describe('CustomsClearanceController', () => {

    const customsClearanceUrl = '/api/myprofile/shipment/defaults/customs/clearance';
    const plainObj = {};
    let sut;
    let $q;
    let $timeout;
    let crudServiceMock;
    let navigationServiceMock;
    let getDefer;
    let updateDefer;
    let getMockResponse = {
        invoiceType: 'EXISTING',
        selectedShipmentPurpose: 'RETURN',
        shipmentPurposes: [
            {
                key: 'OWN',
                name: 'my_own_shipment'
            },
            {
                key: 'RETURN',
                name: 'return_shipments'
            }
        ],
        shipmentDescription: 'my shipment',
        shipmentValue: 23.32,
        selectedCurrency: 'EUR',
        currencies: [
            'EUR',
            'USD'
        ],
        incoterms: [
            {
                key: 'i1',
                name: 'incoterms_i1'
            },
            {
                key: 'i2',
                name: 'incoterms_i2'
            },
            {
                key: 'i3',
                name: 'incoterms_i3'
            }
        ],
        selectedIncoterm: 'i3'
    };

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        getDefer = $q.defer();
        updateDefer = $q.defer();
        navigationServiceMock = jasmine.mockComponent(new NavigationService());
        navigationServiceMock.getParamFromUrl.and.returnValue('customsClearance');
        crudServiceMock = jasmine.mockComponent(new EwfCrudService());
        crudServiceMock.getElementList.and.returnValue(getDefer.promise);
        crudServiceMock.updateElement.and.returnValue(updateDefer.promise);
        sut = new CustomsClearanceController(crudServiceMock, navigationServiceMock);
        sut.customsClearance = plainObj;
        spyOn(sut, 'getCustomsClearance').and.callThrough();
    }));

    describe('#init', () => {
        beforeEach(() => {
            sut.init();
        });

        it('should get customs clearance defaults', () => {
            expect(sut.getCustomsClearance).toHaveBeenCalled();
        });

        it('should save defaults, when response come', () => {
            getDefer.resolve(getMockResponse);
            $timeout.flush();
            expect(sut.customsClearance).toEqual(getMockResponse);
        });

        it('should set shipmentValue if no such in response', () => {
            getDefer.resolve({
                shipmentPurposes: [],
                incoterms: []
            });
            $timeout.flush();
            expect(sut.customsClearance.shipmentValue).toEqual('0.00');
        });

        it('should set show block in edit mode depends section parameter from url', () => {
            expect(sut.editMode).toBeTruthy();
        });
    });

    describe('#getCustomsClearance', () => {
        it('should call crud service with correct params', () => {
            sut.getCustomsClearance();
            expect(crudServiceMock.getElementList).toHaveBeenCalledWith(customsClearanceUrl);
        });
    });

    describe('#updateCustomsClearance', () => {

        beforeEach(() => {
            sut.editMode = true;
            sut.updateCustomsClearance();
            updateDefer.resolve();
            $timeout.flush();
        });

        it('should call crud service with correct params', () => {
            expect(crudServiceMock.updateElement).toHaveBeenCalledWith(customsClearanceUrl, plainObj);
        });

        it('should set edit mode to false when succeed', () => {
            expect(sut.editMode).toBeFalsy();
        });
    });

    describe('#toggleEditMode', () => {
        it('should toggle boolean value of edit mode', () => {
            sut.editMode = true;
            sut.toggleEditMode();
            expect(sut.editMode).toBeFalsy();
        });
    });

    describe('#resetToDefault', () => {

        beforeEach(() => {
            sut.init();
            getDefer.resolve(getMockResponse);
            $timeout.flush();
        });

        it('should reset customs clearance to server values', () => {
            sut.customsClearance.newProp = 'some value';
            expect(sut.customsClearance.newProp).toBeDefined();
            sut.resetToDefault();
            expect(sut.customsClearance.newProp).not.toBeDefined();
        });

        it('should set edit mode to false', () => {
            sut.editMode = true;
            sut.resetToDefault();
            expect(sut.editMode).toBeFalsy();
        });
    });

    describe('#resetInvoiceType', () => {
        it('should change invoiceType to \'None\'', () => {
            sut.customsClearance.invoiceType = 'some value';
            sut.resetInvoiceType();
            expect(sut.customsClearance.invoiceType).toEqual('NONE');
        });
    });

    describe('#getSelectedShipmentPurpose', () => {
        it('should select correct purpose from the list, according to response', () => {
            const purpose = {
                key: 1
            };
            sut.customsClearance.shipmentPurposes = [{}, purpose];
            sut.customsClearance.selectedShipmentPurpose = 1;
            expect(sut.getSelectedShipmentPurpose()).toEqual(purpose);
        });
    });

    describe('#getSelectedIncoterm', () => {
        it('should select correct incoterm from the list, according to response', () => {
            const incoterm = {
                key: 1
            };
            sut.customsClearance.incoterms = [{}, incoterm];
            sut.customsClearance.selectedIncoterm = 1;
            expect(sut.getSelectedShipmentPurpose()).toEqual(incoterm);
        });
    });

    describe('#setSelectedValues', () => {

        beforeEach(() => {
            sut.init();
            getDefer.resolve(getMockResponse);
            $timeout.flush();
            sut.setSelectedValues();
        });

        it('should set selected shipment purpose according to response', () => {
            expect(sut.selectedShipmentPurpose.key).toEqual(getMockResponse.selectedShipmentPurpose);
        });

        it('should set selected incoterm according to response', () => {
            expect(sut.selectedIncoterm.key).toEqual(getMockResponse.selectedIncoterm);
        });
    });
});

