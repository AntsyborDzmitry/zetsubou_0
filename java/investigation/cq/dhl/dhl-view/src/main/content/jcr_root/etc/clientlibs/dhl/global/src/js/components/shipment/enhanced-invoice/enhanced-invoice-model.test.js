import EnhancedInvoiceModel from './enhanced-invoice-model';
import NlsService from './../../../services/nls-service';
import ItemAttributesModel from './../shipment-type/item-attributes/item-attributes-model';
import ShipmentService from './../ewf-shipment-service';
import 'angularMocks';

describe('EnhancedInvoiceModel', () => {
    let sut;
    let $filter, nlsService, shipmentService, itemAttributesModel;

    beforeEach(inject((_$filter_) => {
        $filter = _$filter_;
        shipmentService = jasmine.mockComponent(new ShipmentService());
        nlsService = jasmine.mockComponent(new NlsService());
        nlsService.getTranslationSync.and.returnValue('translation');
        itemAttributesModel = jasmine.mockComponent(new ItemAttributesModel());

        sut = new EnhancedInvoiceModel($filter, nlsService, shipmentService, itemAttributesModel);
    }));

    describe('#init', () => {
        it('should set current date', () => {
            sut.init();
            expect(sut.currentDate).toEqual($filter('date')(new Date(), 'MM/dd/yyyy'));
        });

        it('should set invoice params', () => {
            const shipperData = {name: 'Alex', country: 'US'};
            sut.init(shipperData);

            expect(sut).toEqual(jasmine.objectContaining(shipperData));
        });

        it('should generate 5 options based on source types array', () => {
            sut.init();
            expect(sut.exporterIdTypes.length).toEqual(5);
        });

        it('should call translation service 5 times', () => {
            sut.init();
            expect(nlsService.getTranslationSync.calls.count()).toEqual(5);
        });

        it('should set export id types', () => {
            sut.init();
            expect(sut.exporterIdTypes[0]).toEqual(jasmine.objectContaining({
                title: jasmine.any(String)
            }));
        });

        it('should set invoiceUserName if involvedPartiesData available', () => {
            const name = 'test name';
            sut.init({
                involvedPartiesData: {
                    shipper: {name}
                }
            });

            expect(sut.invoiceUserName).toEqual(name);
        });

        it('should get receiver contact details', () => {
            sut.init();
            expect(shipmentService.getReceiverContactDetails).toHaveBeenCalledWith();
        });

        it('should retrieve data if already initialized', () => {
            sut.init();
            sut.init();
            expect(shipmentService.getReceiverContactDetails.calls.count()).toEqual(1);
        });
    });

    describe('#toggleShowCountriesList', () => {
        it('should turn on state of showing country list if state true', () => {
            const state = true;
            sut.toggleShowCountriesList(state);
            expect(sut.isCountriesListVisible).toEqual(state);
        });

        it('should turn on state of showing country list if state false', () => {
            const state = false;
            sut.toggleShowCountriesList(state);
            expect(sut.isCountriesListVisible).toEqual(state);
        });
    });

    describe('#pickCountry', () => {
        const country = {
            name: 'USA',
            code2: 'US'
        };
        it('should turn on state of showing country list if state true', () => {
            sut.pickCountry(country);
            expect(sut.country).toEqual(jasmine.objectContaining(country));
        });

        it('should close countries dropdown after pick', () => {
            sut.pickCountry(country);
            expect(sut.isCountriesListVisible).toEqual(false);
        });
    });

    describe('#isCodeSelected', () => {
        it('should return true if not NONE option chosen in exportIdType selector', () => {
            sut.exportIdType = 'DUNS Number';
            const result = sut.isCodeSelected();
            expect(result).toEqual(true);
        });

        it('should return false if NONE option chosen in exportIdType selector', () => {
            sut.exportIdType = 'NONE';
            const result = sut.isCodeSelected();
            expect(result).toEqual(false);
        });

        it('should return false if nothing chosen in exportIdType selector', () => {
            sut.exportIdType = '';
            const result = sut.isCodeSelected();
            expect(result).toEqual(false);
        });
    });

    describe('#cacheModel', () => {
        function copyCallsLengthBySource(argumentPassed) {
            return angular.copy.calls.allArgs().filter(([src]) => src === argumentPassed).length;
        }

        beforeEach(() => {
            spyOn(angular, 'copy').and.callThrough();
        });

        it('should cache item-attributes-model each time', () => {
            sut.cacheModel();
            sut.cacheModel();

            expect(copyCallsLengthBySource(itemAttributesModel)).toEqual(2);
        });

        it('should cache enhanced-invoice-model only once', () => {
            sut.cacheModel();
            sut.cacheModel();

            expect(copyCallsLengthBySource(sut)).toEqual(1);
        });
    });

    describe('#resetModel', () => {
        it('should reset last cached item-attributes-model', () => {
            const expectedValue = 'some value';
            itemAttributesModel.test = 'initial value';
            sut.cacheModel();
            itemAttributesModel.test = expectedValue;
            sut.cacheModel();

            sut.resetModel();

            expect(itemAttributesModel.test).toEqual(expectedValue);
        });

        it('should reset first cached enhanced-invoice-model', () => {
            const expectedValue = 'initial value';
            sut.test = expectedValue;
            sut.cacheModel();
            sut.test = 'other value';
            sut.cacheModel();

            sut.resetModel();

            expect(sut.test).toEqual(expectedValue);
        });
    });

    describe('#clearAddress', () => {
        it('should clear contact details form', () => {
            sut.contactDetails = {details: 'details'};
            sut.clearAddress();
            expect(sut.contactDetails).toEqual({
                phone: {
                    phoneDetails: {}
                }
            });
        });
    });

    describe('#setContactDetails', () => {
        it('should set contact details to model', () => {
            const contact = {
                contactName: 'Name',
                companyName: 'Company',
                email: 'some@email.com',
                nickName: 'nickName',
                phoneCountryCode: '11',
                phoneExt: '2',
                phoneNumber: '12345',
                phoneType: 'Mobile',
                fax: '456',
                smsEnabled: true,
                address: 'some address',
                address2: 'another address',
                address3: 'one more address',
                country: 'USA',
                countryCode: 'US',
                zipOrPostCode: '34',
                city: 'LA',
                stateOrProvince: true,
                residentialAddress: false,
                key: 'some key'
            };

            sut.contactDetails = {};
            sut.setContactDetails(contact);

            expect(sut.contactDetails).toEqual(jasmine.objectContaining({
                name: contact.contactName,
                company: contact.companyName,
                email: contact.email,
                nickName: contact.nickName,
                phone: {
                    phoneDetails: {
                        phoneCountryCode: contact.phoneCountryCode,
                        phoneExt: contact.phoneExt,
                        phone: contact.phoneNumber,
                        phoneType: contact.phoneType,
                        fax: contact.fax,
                        smsEnabled: contact.smsEnabled
                    }
                },
                addressDetails: {
                    addrLine1: contact.address,
                    addrLine2: contact.address2,
                    addrLine3: contact.address3,
                    countryName: contact.country,
                    countryCode: contact.countryCode,
                    zipOrPostCode: contact.zipOrPostCode,
                    city: contact.city,
                    stateOrProvince: contact.stateOrProvince,
                    residentialAddress: contact.residentialAddress,
                    key: contact.key
                }
            }));
        });
    });
});
