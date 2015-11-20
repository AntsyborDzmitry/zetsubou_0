import MyDhlAccountsDefaultsController from './my-dhl-accounts-defaults-controller';
import profileAccountSettingsService from './../profile-account-settings-service';
import SystemSettings from './../../../constants/system-settings-constants';
import 'angularMocks';
import angular from 'angular';

describe('MyDhlAccountsDefaultsController', () => {
    let sut;
    let profileAccountSettingsServiceMock;
    let $q, $timeout;
    let accountSettingsPromise, updateSettingsPromise;
    let timeoutMock, nlsServiceMock;

    let availableAccounts, shipmentOptions, dutiesAndTaxesOptions, serviceResponse;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        availableAccounts = [{key: 4, data: {title: 'title_to_translate'}, title: undefined}];
        shipmentOptions = [{key: 2, data: {title: 'title_to_translate'}, title: undefined}];
        dutiesAndTaxesOptions = [{key: 1, data: {title: 'title_to_translate'}, title: undefined}];
        serviceResponse = {
            maskDhlAccounts: false,
            dutiesAndTaxesOptions: angular.copy(dutiesAndTaxesOptions),
            shipmentOptions: angular.copy(shipmentOptions),
            selectedAccountInfo: [{key: 3, data: {title: 'title_to_translate'}, title: undefined}],
            availableAccounts: angular.copy(availableAccounts),
            availableForDutiesAndTaxes: [{key: 5, data: {title: 'title_to_translate'}, title: undefined}],
            available: [
                {
                    key: '193112eiqwoei109e101',
                    accountNumber: '8794564968',
                    accountNickname: '',
                    title: '8794564968 - ',
                    useForTransportationCharges: false,
                    alternative: false,
                    accountType: 'SHIPPER',
                    primary: false,
                    status: 'APPROVED',
                    receiverPaidAccount: true
                }
            ]
        };

        accountSettingsPromise = $q.defer();
        updateSettingsPromise = $q.defer();

        timeoutMock = jasmine.createSpy('timeoutMock');
        nlsServiceMock = jasmine.createSpyObj('nlsService', ['getTranslation']);

        profileAccountSettingsServiceMock = jasmine.mockComponent(new profileAccountSettingsService());

        profileAccountSettingsServiceMock.getMyDhlAccountsDefaults.and.returnValue(accountSettingsPromise.promise);
        profileAccountSettingsServiceMock.updateMyDhlAccountsDefaults.and.returnValue(updateSettingsPromise.promise);

        sut = new MyDhlAccountsDefaultsController(
            timeoutMock,
            $q,
            profileAccountSettingsServiceMock,
            nlsServiceMock,
            SystemSettings
        );
    }));

    describe('#MyDhlAccountsDefaultsController', () => {
        it('should init controller data', () => {

            accountSettingsPromise.resolve(serviceResponse);
            $timeout.flush();

            expect(sut.selectedAccountInfo).toBe(serviceResponse.selectedAccountInfo);
            expect(sut.maskDhlAccounts).toBe(serviceResponse.maskDhlAccounts);
            expect(sut.availableForDutiesAndTaxes)
                .toEqual(availableAccounts.concat(dutiesAndTaxesOptions));
            expect(sut.availableForShipment)
                .toEqual(availableAccounts.concat(shipmentOptions));
        });

        it('should update controller data', () => {

            sut.updateAccountsDefaults();

            accountSettingsPromise.resolve(serviceResponse);
            updateSettingsPromise.resolve();
            $timeout.flush();

            expect(sut.selectedAccountInfo).toBe(serviceResponse.selectedAccountInfo);
            expect(sut.maskDhlAccounts).toBe(serviceResponse.maskDhlAccounts);
            expect(sut.availableForDutiesAndTaxes)
                .toEqual(availableAccounts.concat(dutiesAndTaxesOptions));
            expect(sut.availableForShipment)
                .toEqual(availableAccounts.concat(dutiesAndTaxesOptions, shipmentOptions));
            expect(timeoutMock).toHaveBeenCalled();
        });

    });
});
