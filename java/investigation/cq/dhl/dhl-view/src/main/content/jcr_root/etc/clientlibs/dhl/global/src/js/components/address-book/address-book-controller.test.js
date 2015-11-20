import AddressBookController from './address-book-controller';
import AttrsService from './../../services/attrs-service';
import ColumnCustomizationService from './column-customization/column-customization-service';
import NlsService from './../../services/nls-service';
import EwfSpinnerService from './../../services/ewf-spinner-service';
import 'angularMocks';

describe('AddressBookController', () => {
    let sut, $scope, $q, $attrs, $parse, defer;
    let attrsServiceMock, columnCustomizationServiceMock, nlsService, ewfSpinnerServiceMock;

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {

        $scope = _$rootScope_.$new();
        $q = _$q_;
        defer = $q.defer();

        $attrs = {
            onSelection: `addressDetailsCtrl.addressBookSelected($selection, addressDetailsCtrl.FROM);
                          addressCtrl.showPopup = false`,
            isPopup: true
        };

        const availableColumns = [
            {alias: 'nickName'},
            {alias: 'contactName'},
            {alias: 'address'},
            {alias: 'city'},
            {alias: 'country'},
            {alias: 'fax'},
            {alias: 'phoneNumber'},
            {alias: 'contctId'},
            {alias: 'Id'},
            {alias: 'countryId'}
        ];

        ewfSpinnerServiceMock = jasmine.mockComponent(new EwfSpinnerService());
        attrsServiceMock = jasmine.mockComponent(new AttrsService($parse));
        attrsServiceMock.trigger.and.returnValue(defer.promise);

        nlsService = jasmine.mockComponent(new NlsService());
        nlsService.getTranslation.and.returnValues($q.when([]));

        columnCustomizationServiceMock = jasmine.mockComponent(new ColumnCustomizationService($parse));
        columnCustomizationServiceMock.getColumnsInfo.and.returnValue($q.when({available: availableColumns}));
        columnCustomizationServiceMock.updateColumnsInfo.and.returnValue(defer.promise);

        sut = new AddressBookController(
            $q,
            $scope,
            $attrs,
            attrsServiceMock,
            columnCustomizationServiceMock,
            nlsService,
            ewfSpinnerServiceMock
        );
        _$timeout_.flush();
    }));

    it('should check initialization of address book with spinner', () => {
        expect(sut.isPopup).toBe(true);
        expect(columnCustomizationServiceMock.getColumnsInfo).toHaveBeenCalled();
        expect(ewfSpinnerServiceMock.applySpinner).toHaveBeenCalled();
    });

    it('should check if trigger method called', () => {
        const selection = {
            address: 'ADDR_LINE1',
            address2: 'ADDR_LINE2',
            address3: 'ADDR_LINE3',
            city: 'CITY_NAME',
            companyName: 'COMPANY_NAME',
            contactName: 'CONTACT_NAME',
            country: 'COUNTRY_DHL_NAME',
            countryCode: 'US',
            email: 'EMAIL@TEST.COM',
            fax: 'FAX',
            hover: true,
            key: '939',
            matchCode: 'MATCH_CODE',
            nickName: 'CONTACT_NICKNAME',
            phoneCountryCode: '380',
            phoneExt: '044',
            phoneNumber: 'PHONE_NUMBER',
            phoneType: 'OFFICE',
            smsEnabled: false,
            stateOrProvince: 'STATE_OR_PROVINCE',
            suburb: 'CITY_SUBURB_NAME',
            vatOrTaxId: 'TAX_ID',
            zipOrPostCode: 'ZIP_OR_POST'
        };
        const index = 1;

        sut.onSelection(selection, index);
        expect(attrsServiceMock.trigger)
            .toHaveBeenCalledWith($scope, $attrs, 'onSelection', {$selection: selection, $index: index});
        expect(columnCustomizationServiceMock.getColumnsInfo).toHaveBeenCalled();
    });

    it('should update columns info', () => {
        const columnsData = {
            column1: {
                alias: 'alias1'
            },
            column2: {
                alias: 'alias2'
            }
        };
        sut.handleColumnsChange(columnsData);
        expect(columnCustomizationServiceMock.updateColumnsInfo).toHaveBeenCalledWith(columnsData);
        expect(columnCustomizationServiceMock.getColumnsInfo).toHaveBeenCalled();
    });

    it('should set default columns', () => {
        const defaultColumnsToDisplay = ['nickName', 'contactName', 'address', 'city', 'country'];
        const allColumnsPresent = sut.columnsToDisplay
            .every((columnData) => defaultColumnsToDisplay.includes(columnData.alias));
        expect(allColumnsPresent).toBe(true);
        expect(sut.columnsToDisplay.length).toBe(defaultColumnsToDisplay.length);
    });
});
