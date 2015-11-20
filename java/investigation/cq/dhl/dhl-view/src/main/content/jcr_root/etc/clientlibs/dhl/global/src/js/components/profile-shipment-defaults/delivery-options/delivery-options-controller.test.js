import DeliveryOptionsController from './delivery-options-controller';
import DeliveryOptionsService from './delivery-options-service';
import NavigationService from './../../../services/navigation-service';
import 'angularMocks';

describe('DeliveryOptionsController', () => {
    let $timeout;
    let $q;
    let sut;
    let deliveryServiceMock;
    let navigationServiceMock;
    let getDefer;
    let postDefer;
    const getOptionsResponse = {
        options: {
            shipmentType: 'NONE',
            documentDescription: 'My docs',
            deliveryOptions: [
                {
                    key: 'DAYEND',
                    name: 'delivery_options_express_dayend'
                },
                {
                    key: '12EXPRESS',
                    name: 'delivery_options_express_12'
                },
                {
                    key: '9EXPRESS',
                    name: 'delivery_options_express_9'
                }
            ],
            selectedDeliveryOptionsKey: '9EXPRESS',
            shippingCountry: 'BR'
        },
        countryList: [
            {
                code2: 'BR',
                code3: 'BRA',
                name: 'BRAZIL',
                phoneCode: '55'
            },
            {
                code2: 'CN',
                code3: 'CHN',
                name: 'CHINA, PEOPLES REPUBLIC',
                phoneCode: '86'
            }
        ]
    };

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        getDefer = $q.defer();
        postDefer = $q.defer();
        deliveryServiceMock = jasmine.mockComponent(new DeliveryOptionsService());
        deliveryServiceMock.getData.and.returnValue(getDefer.promise);
        deliveryServiceMock.saveOptions.and.returnValue(postDefer.promise);
        navigationServiceMock = jasmine.mockComponent(new NavigationService());
        navigationServiceMock.getParamFromUrl.and.returnValue('deliveryOptions');
        sut = new DeliveryOptionsController(deliveryServiceMock, navigationServiceMock);
        sut.options = {
            deliveryOptions: []
        };
    }));

    describe('#init', () => {

        beforeEach(() => {
            sut.init();
            getDefer.resolve(getOptionsResponse);
            $timeout.flush();
        });

        it('should call delivery options service to get options and countries', () => {
            expect(deliveryServiceMock.getData).toHaveBeenCalled();
        });

        it('should save delivery options when response come', () => {
            expect(sut.options).toEqual(getOptionsResponse.options);
            expect(sut.countryList).toEqual(getOptionsResponse.countryList);
        });

        it('should set connected to true, when response come', () => {
            expect(sut.connected).toBeTruthy();
        });

        it('should define options', () => {
            expect(sut.options).toBeDefined();
        });

        it('should set edit mode to true if section parametr from url is delivery option', () => {
            expect(sut.editMode).toBeTruthy();
        });
    });

    describe('#saveDeliveryOptions', () => {
        it('should save options with correct params', () => {
            const params = {};
            sut.options = params;
            sut.saveDeliveryOptions();
            expect(deliveryServiceMock.saveOptions).toHaveBeenCalledWith(params);
        });

        it('should save options with empty country option', () => {
            const params = {};
            sut.options = params;
            sut.shipperCountry = '';
            sut.saveDeliveryOptions();
            expect(deliveryServiceMock.saveOptions).toHaveBeenCalledWith(params);
            expect(sut.options.shippingCountry).toBe('');
        });

        it('should save options with empty delivery method', () => {
            const params = {};
            sut.options = params;
            sut.selectedOption = '';
            sut.saveDeliveryOptions();
            expect(deliveryServiceMock.saveOptions).toHaveBeenCalledWith(params);
            expect(sut.options.selectedDeliveryOptionsKey).toBe('');
        });

        it('should exit from edit mode after saving', () => {
            sut.editMode = true;
            sut.saveDeliveryOptions();
            postDefer.resolve();
            $timeout.flush();
            expect(sut.editMode).toBeFalsy();
        });

        it('should refresh delivery defaults', () => {
            sut.editMode = true;
            sut.saveDeliveryOptions();
            postDefer.resolve(getOptionsResponse);
            $timeout.flush();
            sut.resetDefaults();
            expect(sut.options).toEqual(getOptionsResponse.options);
            expect(sut.countryList).toEqual(getOptionsResponse.countryList);
        });

    });

    describe('#resetShipmentType', () => {
        it('should reset shipment type', () => {
            sut.resetShipmentType();
            expect(sut.options.shipmentType).toEqual('NONE');
        });
    });

    describe('#toggleEditMode', () => {
        it('should toggle edit mode', () => {
            sut.editMode = false;
            sut.toggleEditMode();
            expect(sut.editMode).toBeTruthy();
            sut.toggleEditMode();
            expect(sut.editMode).toBeFalsy();
        });
    });

    describe('#onCountrySelect', () => {
        it('should set country code on selection', () => {
            const country = {
                code2: 'Country'
            };
            sut.onCountrySelect(country);
            expect(sut.options.shippingCountry).toEqual(country.code2);
        });
    });

    describe('#setShipperCountry', () => {
        it('should set shiping country by code', () => {
            sut.countryList = [{
                code2: 'code2',
                name: 'name'
            }];
            sut.options.shippingCountry = 'code2';
            sut.setShipperCountry();
            expect(sut.shipperCountry).toEqual(sut.countryList[0]);
        });
    });

    describe('#resetDefaults', () => {
        it('should reset values to server defaults if changes has been canceled', () => {
            sut.init();
            getDefer.resolve(getOptionsResponse);
            $timeout.flush();
            sut.options.newProp = 'some value';
            expect(sut.options.newProp).toBeDefined();
            sut.resetDefaults();
            expect(sut.options.newProp).not.toBeDefined();
        });
    });

    describe('#isDocumentType', () => {
        it('should return true if shipment type is documents', () => {
            sut.options.shipmentType = 'DOCUMENT';
            expect(sut.isDocumentType()).toBeTruthy();
        });

        it('should return false if shipment type is not documents', () => {
            sut.options.shipmentType = '';
            expect(sut.isDocumentType()).toBeFalsy();
        });
    });

    describe('#setSelectedValue', () => {
        beforeEach(() => {
            Object.assign(sut, getOptionsResponse);
            sut.setSelectedValue();
        });

        it('should set selected option according to response', () => {
            expect(sut.selectedOption.key).toEqual(getOptionsResponse.options.selectedDeliveryOptionsKey);
        });

        it('should set selected country according to response', () => {
            expect(sut.shipperCountry.code2).toEqual(getOptionsResponse.options.shippingCountry);
        });
    });
});
