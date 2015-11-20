import EwfContactPaymentsInfoController from './contact-payment-info-controller';

import 'angularMocks';

describe('EwfContactPaymentsInfoController', () => {
    let sut, $q, $timeout;
    let ewfCrudServiceMock;
    let attrsServiceMock;
    let mockDeffered;


    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        attrsServiceMock = {
            track: () => {}
        };

        mockDeffered = $q.defer();
        ewfCrudServiceMock = {
            getElementList: jasmine.createSpy('getElementList').and.returnValue(mockDeffered.promise)
        };

        spyOn($q, 'when');

        sut = new EwfContactPaymentsInfoController($q, {}, {}, ewfCrudServiceMock, attrsServiceMock);
    }));

    describe('#init', () => {
        it('should get Support Utilities data on init', () => {
            expect($q.when).toHaveBeenCalledWith(true);
        });

        it('should get Selected Terms Of Trade data on init', () => {
            expect($q.when).toHaveBeenCalledWith(jasmine.any(Array));
        });

        it('should get User Profile Accounts data on init', () => {
            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith('/api/myprofile/accounts');
        });
    });

    describe('Account arrays sorting', () => {
        const selectOneOption = {
            key: null,
            type: null,
            title: 'Select One'
        };

        const alternateDHLAccountOption = {
            key: null,
            type: 'ALTERNATE_DHLACCOUNT',
            title: 'Alternate DHL Account Number'
        };
        const dutiesAndTaxesOptions = {
            key: null,
            type: 'RECEIVER_WILL_PAY',
            title: 'Receiver Will Pay'
        };
        let expectedResult;

        beforeEach(() => {
            const mockedResponse = [
                {
                    key: '1',
                    type: 'DHL_ACCOUNT',
                    title: '1 - a',
                    accountNickname: 'a'
                },
                {
                    key: '2',
                    type: 'DHL_ACCOUNT',
                    title: '2 - C',
                    accountNickname: 'C'
                },
                {
                    key: '3',
                    type: 'DHL_ACCOUNT',
                    title: '3 - b',
                    accountNickname: 'b'
                }
            ];
            expectedResult = [
                {
                    key: '1',
                    type: 'DHL_ACCOUNT',
                    title: '1 - a',
                    accountNickname: 'a'
                },
                {
                    key: '3',
                    type: 'DHL_ACCOUNT',
                    title: '3 - b',
                    accountNickname: 'b'
                },
                {
                    key: '2',
                    type: 'DHL_ACCOUNT',
                    title: '2 - C',
                    accountNickname: 'C'
                }
            ];

            mockDeffered.resolve(mockedResponse);
            $timeout.flush();
        });

        it('should set sorted accountForShippingCharges', () => {
            expectedResult.unshift(selectOneOption);
            expectedResult.push(alternateDHLAccountOption);

            expect(sut.accountForShippingCharges).toEqual(expectedResult);
        });

        it('should set sorted accountForDuties', () => {
            expectedResult.unshift(selectOneOption);
            expectedResult.push(dutiesAndTaxesOptions);
            expectedResult.push(alternateDHLAccountOption);

            expect(sut.accountForDuties).toEqual(expectedResult);
        });

        it('should set sorted accountForTaxes', () => {
            expectedResult.unshift(selectOneOption);
            expectedResult.push(dutiesAndTaxesOptions);
            expectedResult.push(alternateDHLAccountOption);

            expect(sut.accountForTaxes).toEqual(expectedResult);
        });
    });

    describe('flags for payments section', () => {
        it('should hide duties and taxes option when used doesn`t have DHL accounts', () => {
            mockDeffered.resolve([]);
            $timeout.flush();

            expect(sut.isUserProfileAccounts).toBe(false);
        });

        it('should show duties and taxes option when used has at least one DHL account', () => {
            const mockedResponse = [
                {
                    key: '1',
                    type: 'DHL_ACCOUNT',
                    title: '1 - a',
                    accountNickname: 'a'
                }
            ];

            mockDeffered.resolve(mockedResponse);
            $timeout.flush();

            expect(sut.isUserProfileAccounts).toBe(true);
        });

        it('should show default DHL account option when more than one dhl accounts', () => {
            const mockedResponse = [
                {
                    key: '1',
                    type: 'DHL_ACCOUNT',
                    title: '1 - a',
                    accountNickname: 'a'
                },
                {
                    key: '2',
                    type: 'DHL_ACCOUNT',
                    title: '2 - b',
                    accountNickname: 'b'
                }
            ];

            mockDeffered.resolve(mockedResponse);
            $timeout.flush();

            expect(sut.multipleDefaultAccounts).toBe(true);
        });

        it('should hide default DHL account option when more less one dhl accounts', () => {
            const mockedResponse = [
                {
                    key: '1',
                    type: 'DHL_ACCOUNT',
                    title: '1 - a',
                    accountNickname: 'a'
                }
            ];

            mockDeffered.resolve(mockedResponse);
            $timeout.flush();

            expect(sut.multipleDefaultAccounts).toBe(false);
        });
    });

    describe('#mapOption', () => {
        it('will return input option value if it is falsy', () => {
            const mockOption = null;

            expect(sut.mapOption(mockOption)).toEqual(mockOption);
        });

        it('will return option key if it contains truthy key field', () => {
            const mockOptionKey = 'some mock option key';
            const mockOption = {
                key: mockOptionKey
            };

            expect(sut.mapOption(mockOption)).toEqual(mockOptionKey);
        });

        it('will return option type if it contains false key field', () => {
            const mockOptionType = 'some mock option type';
            const mockOption = {
                key: null,
                type: mockOptionType
            };

            expect(sut.mapOption(mockOption)).toEqual(mockOptionType);
        });
    });
});

